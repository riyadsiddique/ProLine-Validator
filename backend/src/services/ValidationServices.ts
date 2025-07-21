import { getRepository } from 'typeorm';
import { Device } from '../models/Device';
import { ValidationSession } from '../models/ValidationSession';
import { ValidationResult } from '../models/ValidationResult';
import { SecurityService } from './SecurityService';
import { ConfigurationService } from './ConfigurationService';
import { ComplianceService } from './ComplianceService';

export class ValidationService {
  private deviceRepository = getRepository(Device);
  private validationSessionRepository = getRepository(ValidationSession);
  private validationResultRepository = getRepository(ValidationResult);
  private securityService = new SecurityService();
  private configurationService = new ConfigurationService();
  private complianceService = new ComplianceService();

  async startValidation(deviceId: string): Promise<ValidationSession> {
    const device = await this.deviceRepository.findOne({ where: { deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    const session = this.validationSessionRepository.create({
      deviceId: device.id,
      status: 'in_progress',
      startTime: new Date(),
    });

    return this.validationSessionRepository.save(session);
  }

  async validateSecurity(validationId: string, deviceId: string): Promise<any> {
    const session = await this.validateSessionExists(validationId);
    
    const securityResults = await this.securityService.validateDeviceSecurity(
      deviceId,
      {
        rootStatus: false,
        bootloaderStatus: true,
        safetyNetStatus: true,
      }
    );

    await this.saveValidationResult(session.id, 'security', securityResults);
    return securityResults;
  }

  async validateConfiguration(validationId: string, deviceId: string): Promise<any> {
    const session = await this.validateSessionExists(validationId);
    
    const configResults = await this.configurationService.validateDeviceConfiguration(
      deviceId
    );

    await this.saveValidationResult(session.id, 'configuration', configResults);
    return configResults;
  }

  async validateCompliance(validationId: string, deviceId: string): Promise<any> {
    const session = await this.validateSessionExists(validationId);
    
    const complianceResults = await this.complianceService.validateDeviceCompliance(
      deviceId
    );

    await this.saveValidationResult(session.id, 'compliance', complianceResults);
    return complianceResults;
  }

  async completeValidation(validationId: string): Promise<ValidationSession> {
    const session = await this.validateSessionExists(validationId);
    
    const results = await this.validationResultRepository.find({
      where: { validationSessionId: session.id },
    });

    // Calculate overall status
    const hasErrors = results.some(r => r.data.status === 'error');
    const hasWarnings = results.some(r => r.data.status === 'warning');

    session.status = hasErrors ? 'failed' : hasWarnings ? 'warning' : 'passed';
    session.endTime = new Date();

    return this.validationSessionRepository.save(session);
  }

  async generateReport(validationId: string): Promise<Buffer> {
    const session = await this.validationSessionExists(validationId);
    const results = await this.validationResultRepository.find({
      where: { validationSessionId: session.id },
    });

    // Generate PDF report
    // Implementation depends on your PDF generation library
    // Return Buffer containing PDF data
    return Buffer.from('PDF Report');
  }

  private async validateSessionExists(validationId: string): Promise<ValidationSession> {
    const session = await this.validationSessionRepository.findOne({
      where: { id: validationId },
    });

    if (!session) {
      throw new Error('Validation session not found');
    }

    return session;
  }

  private async saveValidationResult(
    sessionId: string,
    type: string,
    data: any
  ): Promise<ValidationResult> {
    const result = this.validationResultRepository.create({
      validationSessionId: sessionId,
      type,
      data,
      timestamp: new Date(),
    });

    return this.validationResultRepository.save(result);
  }
}
