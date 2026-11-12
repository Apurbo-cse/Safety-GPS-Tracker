import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHeroSlides1794397824435 implements MigrationInterface {
    name = 'AddHeroSlides1794397824435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hero_slides" ("sort" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(60) NOT NULL, "tab" character varying(30) NOT NULL, "badge" character varying(80) NOT NULL, "badge_icon" character varying(20) NOT NULL DEFAULT 'shield', "title_main" character varying(120) NOT NULL, "title_highlight" character varying(120) NOT NULL, "text" character varying(300) NOT NULL, "bg_image" character varying(240) NOT NULL, "accent" character varying(20) NOT NULL DEFAULT 'brand', "cta_label" character varying(40) NOT NULL, "cta_href" character varying(200) NOT NULL, "telematics" jsonb NOT NULL, CONSTRAINT "PK_a66cc04fc23dc34ba5627fbbef4" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DROP TABLE "hero_slides"`);
    }

}
