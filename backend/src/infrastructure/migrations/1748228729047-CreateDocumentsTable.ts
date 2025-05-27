import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocumentsTable1748228729047 implements MigrationInterface {
    name = 'CreateDocumentsTable1748228729047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" SERIAL PRIMARY KEY,
                "fileName" character varying NOT NULL,
                "originalName" character varying NOT NULL,
                "mimeType" character varying NOT NULL,
                "path" character varying NOT NULL,
                "size" integer NOT NULL,
                "type" character varying NOT NULL,
                "candidateId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_candidate_documents" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "documents"`);
    }
} 