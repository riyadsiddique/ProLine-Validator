import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1689778392000 implements MigrationInterface {
    name = 'InitialSchema1689778392000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add your schema creation SQL here
        await queryRunner.query(`
            CREATE TABLE "super_admins" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL UNIQUE,
                "name" varchar NOT NULL,
                "password_hash" varchar NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Add other table creation queries
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add your schema rollback SQL here
        await queryRunner.query(`DROP TABLE "super_admins"`);
        // Add other table drop queries
    }
}
