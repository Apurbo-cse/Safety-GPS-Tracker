import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaAndProductImages1794398820811 implements MigrationInterface {
    name = 'AddMediaAndProductImages1794398820811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "mime" character varying(20) NOT NULL, "size" integer NOT NULL, "sha256" character varying(64) NOT NULL, "data" bytea NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a459f2e49c923a3f7f60532f8f" ON "media"  ("sha256") `);
        await queryRunner.query(`ALTER TABLE "devices" ADD "images" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "plans" ALTER COLUMN "features" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "specs" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "features" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "settings" SET DEFAULT '{"alerts":{"ignition":true,"geofence":true,"speed":true,"tamper":true,"sos":true,"documents":true,"billing":true},"channels":{"push":true,"sms":true,"email":false},"speedLimit":80,"language":"en","units":"km","twoFactor":false,"marketing":false}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "settings" SET DEFAULT '{"units": "km", "alerts": {"sos": true, "speed": true, "tamper": true, "billing": true, "geofence": true, "ignition": true, "documents": true}, "channels": {"sms": true, "push": true, "email": false}, "language": "en", "marketing": false, "twoFactor": false, "speedLimit": 80}'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "features" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "specs" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "plans" ALTER COLUMN "features" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a459f2e49c923a3f7f60532f8f"`);
        await queryRunner.query(`DROP TABLE "media"`);
    }

}
