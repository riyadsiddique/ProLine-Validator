import CryptoJS from 'crypto-js';

class EncryptionService {
  private readonly KEY_PREFIX = 'PL_';
  private readonly IV_LENGTH = 16;
  private readonly SALT_LENGTH = 16;
  private readonly KEY_SIZE = 256;
  private readonly ITERATIONS = 10000;

  private async generateKey(password: string, salt: Uint8Array): Promise<CryptoJS.lib.WordArray> {
    return new Promise((resolve) => {
      const keyMaterial = CryptoJS.PBKDF2(
        password,
        CryptoJS.lib.WordArray.create(salt),
        {
          keySize: this.KEY_SIZE / 32,
          iterations: this.ITERATIONS
        }
      );
      resolve(keyMaterial);
    });
  }

  public async encryptData(data: any, key: string): Promise<string> {
    try {
      // Generate random salt and IV
      const salt = CryptoJS.lib.WordArray.random(this.SALT_LENGTH);
      const iv = CryptoJS.lib.WordArray.random(this.IV_LENGTH);

      // Derive key using PBKDF2
      const derivedKey = await this.generateKey(this.KEY_PREFIX + key, salt.toString());

      // Stringify data if it's an object
      const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);

      // Encrypt using AES-GCM
      const encrypted = CryptoJS.AES.encrypt(dataString, derivedKey, {
        iv: iv,
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.Pkcs7
      });

      // Combine salt, IV, and ciphertext
      const combined = salt.concat(iv).concat(encrypted.ciphertext);

      // Return base64 encoded string
      return CryptoJS.enc.Base64.stringify(combined);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  public async decryptData(encryptedData: string, key: string): Promise<any> {
    try {
      // Decode base64
      const combined = CryptoJS.enc.Base64.parse(encryptedData);

      // Extract salt, IV, and ciphertext
      const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, this.SALT_LENGTH / 4));
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(this.SALT_LENGTH / 4, (this.SALT_LENGTH + this.IV_LENGTH) / 4));
      const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice((this.SALT_LENGTH + this.IV_LENGTH) / 4));

      // Derive key using PBKDF2
      const derivedKey = await this.generateKey(this.KEY_PREFIX + key, salt.toString());

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        derivedKey,
        {
          iv: iv,
          mode: CryptoJS.mode.GCM,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      // Convert to string
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

      // Try to parse as JSON, return as is if not valid JSON
      try {
        return JSON.parse(decryptedStr);
      } catch {
        return decryptedStr;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = CryptoJS.lib.WordArray.random(this.SALT_LENGTH);
    const hashedPassword = await this.generateKey(password, salt.toString());
    return `${salt.toString()}.${hashedPassword.toString()}`;
  }

  public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split('.');
    const computedHash = await this.generateKey(password, salt);
    return computedHash.toString() === hash;
  }
}

export const encryptionService = new EncryptionService();
