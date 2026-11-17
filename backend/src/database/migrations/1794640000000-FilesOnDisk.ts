import { MigrationInterface, QueryRunner } from "typeorm";

/** Pictures are kept as files on the server (STORAGE_DIR); the media table only keeps their details. Older uploads still held in the database keep working. */
export class FilesOnDisk1794640000000 implements MigrationInterface {
    name = 'FilesOnDisk1794640000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "data" DROP NOT NULL`);
        await queryRunner.query(`DELETE FROM "media" WHERE "path" IS NOT NULL`); // site pictures are plain files again
        await queryRunner.query(`DROP INDEX IF EXISTS "UQ_media_path"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "path"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "path" character varying(240)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_media_path" ON "media" ("path") WHERE "path" IS NOT NULL`);
    }
}
