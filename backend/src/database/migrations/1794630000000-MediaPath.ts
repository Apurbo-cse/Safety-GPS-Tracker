import { MigrationInterface, QueryRunner } from "typeorm";

/** Site pictures (hero, products, logos…) live in the database as binary, found by their path (/img/…). */
export class MediaPath1794630000000 implements MigrationInterface {
    name = 'MediaPath1794630000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "path" character varying(240)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_media_path" ON "media" ("path") WHERE "path" IS NOT NULL`);
        // two paths may hold the same picture, so the hash is no longer unique (uploads still reuse a matching one)
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_a459f2e49c923a3f7f60532f8f"`);
        await queryRunner.query(`CREATE INDEX "IDX_media_sha256" ON "media" ("sha256")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_media_sha256"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "path"`);
    }
}
