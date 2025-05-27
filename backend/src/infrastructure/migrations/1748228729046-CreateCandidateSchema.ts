import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCandidateSchema1748228729046 implements MigrationInterface {
    name = 'CreateCandidateSchema1748228729046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "candidate" (
                "id" SERIAL PRIMARY KEY,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL UNIQUE,
                "phone" character varying NOT NULL,
                "address" character varying,
                "technicalSkills" text,
                "yearsOfExperience" integer DEFAULT 0,
                "currentPosition" character varying,
                "preferredRole" character varying,
                "cvFileUrl" character varying,
                "isActive" boolean DEFAULT true,
                "dataRetentionDate" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "education" (
                "id" SERIAL PRIMARY KEY,
                "institution" character varying NOT NULL,
                "degree" character varying NOT NULL,
                "fieldOfStudy" character varying NOT NULL,
                "startDate" date NOT NULL,
                "endDate" date,
                "isCurrentlyStudying" boolean DEFAULT false,
                "description" character varying,
                "candidateId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_candidate_education" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "work_experience" (
                "id" SERIAL PRIMARY KEY,
                "company" character varying NOT NULL,
                "position" character varying NOT NULL,
                "startDate" date NOT NULL,
                "endDate" date,
                "isCurrentJob" boolean DEFAULT false,
                "description" text NOT NULL,
                "technologies" text,
                "achievements" character varying,
                "candidateId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_candidate_work_experience" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "work_experience"`);
        await queryRunner.query(`DROP TABLE "education"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
    }
} 