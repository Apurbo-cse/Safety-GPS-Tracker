import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContactMessages1794510000000 implements MigrationInterface {
    name = 'AddContactMessages1794510000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_messages" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "kind" character varying(10) NOT NULL DEFAULT 'contact', "department" character varying(20) NOT NULL DEFAULT 'sales', "name" character varying(120) NOT NULL, "email" character varying(254) NOT NULL DEFAULT '', "phone" character varying(11) NOT NULL, "fleet" character varying(40) NOT NULL DEFAULT '', "subject" character varying(150) NOT NULL DEFAULT '', "message" text NOT NULL, "status" character varying(10) NOT NULL DEFAULT 'new', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "handled_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_contact_messages_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_contact_messages_status" ON "contact_messages" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_contact_messages_created_at" ON "contact_messages" ("created_at")`);
        // the built-in roles that deal with customers get the new permission (edited or custom roles are left as the owner set them)
        await queryRunner.query(`UPDATE "staff_roles" SET "permissions" = "permissions" || '["messages.manage"]'::jsonb WHERE "id" IN ('manager', 'sales', 'support') AND NOT ("permissions" ? 'messages.manage')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "staff_roles" SET "permissions" = "permissions" - 'messages.manage'`);
        await queryRunner.query(`DROP TABLE "contact_messages"`);
    }
}
