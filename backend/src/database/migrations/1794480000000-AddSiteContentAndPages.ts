import { MigrationInterface, QueryRunner } from "typeorm";
import { DEFAULT_PAGES } from "../../content/default-pages";

export class AddSiteContentAndPages1794480000000 implements MigrationInterface {
    name = 'AddSiteContentAndPages1794480000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site_content" ("key" character varying(40) NOT NULL, "data" jsonb NOT NULL DEFAULT '{}'::jsonb, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_site_content_key" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "pages" ("id" character varying(60) NOT NULL, "title" character varying(120) NOT NULL, "content" text NOT NULL, "published" boolean NOT NULL DEFAULT true, "sort" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_pages_id" PRIMARY KEY ("id"))`);
        // the legal pages start with the text the website shipped with
        for (const p of DEFAULT_PAGES) {
            await queryRunner.query(`INSERT INTO "pages" ("id", "title", "content", "sort") VALUES ($1, $2, $3, $4)`, [p.id, p.title, p.content, p.sort]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "site_content"`);
    }
}
