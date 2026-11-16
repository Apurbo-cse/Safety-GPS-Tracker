import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPushSubscriptions1794610000000 implements MigrationInterface {
    name = 'AddPushSubscriptions1794610000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "push_subscriptions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "endpoint" text NOT NULL, "p256dh" character varying(200) NOT NULL, "auth" character varying(100) NOT NULL, "user_agent" character varying(200) NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_push_subscriptions" PRIMARY KEY ("id"), CONSTRAINT "UQ_push_subscriptions_endpoint" UNIQUE ("endpoint"), CONSTRAINT "FK_push_subscriptions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE INDEX "IDX_push_subscriptions_user" ON "push_subscriptions" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "push_subscriptions"`);
    }
}
