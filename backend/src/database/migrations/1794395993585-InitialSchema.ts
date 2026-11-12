import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794395993585 implements MigrationInterface {
    name = 'InitialSchema1794395993585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plans" ("sort" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(60) NOT NULL, "name" character varying(120) NOT NULL, "device_price" integer NOT NULL, "monthly_charge" integer NOT NULL, "features" jsonb NOT NULL DEFAULT '[]'::jsonb, "highlight" character varying(80), "image" character varying(240), "site_title" character varying(120), "source_no" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "devices" ("sort" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(60) NOT NULL, "name" character varying(120) NOT NULL, "category" character varying(80) NOT NULL, "subcategory" character varying(80) NOT NULL, "visual" character varying(20) NOT NULL, "image" character varying(240), "site_title" character varying(120), "summary" text NOT NULL, "specs" jsonb NOT NULL DEFAULT '[]'::jsonb, "features" jsonb NOT NULL DEFAULT '[]'::jsonb, "price" integer, "monthly" integer, "plan_id" character varying(60), "price_note" character varying(240) NOT NULL DEFAULT '', CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faqs" ("sort" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(80) NOT NULL, "category" character varying(60) NOT NULL, "q" text NOT NULL, "a" text NOT NULL, "tag" character varying(60) NOT NULL DEFAULT '', CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying(254) NOT NULL, "phone" character varying(11), "name" character varying(120) NOT NULL, "password_hash" character varying(100) NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'customer', "vehicle_type" character varying(60), "company" character varying(120) NOT NULL DEFAULT '', "address" character varying(240) NOT NULL DEFAULT '', "division" character varying(40) NOT NULL DEFAULT 'Dhaka', "settings" jsonb NOT NULL DEFAULT '{"alerts":{"ignition":true,"geofence":true,"speed":true,"tamper":true,"sos":true,"documents":true,"billing":true},"channels":{"push":true,"sms":true,"email":false},"speedLimit":80,"language":"en","units":"km","twoFactor":false,"marketing":false}'::jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" character varying(16) NOT NULL, "user_id" uuid NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'received', "payment" character varying(30) NOT NULL, "device_total" integer NOT NULL, "monthly_total" integer NOT NULL, "contact_name" character varying(120) NOT NULL, "contact_phone" character varying(11) NOT NULL, "contact_email" character varying(254) NOT NULL, "address" character varying(240) NOT NULL, "division" character varying(40) NOT NULL, "vehicle_reg" character varying(60) NOT NULL, "vehicle_type" character varying(60) NOT NULL, "preferred_date" date NOT NULL, "note" character varying(300), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a922b820eeef29ac1c6800e826" ON "orders"  ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders"  ("status") `);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "order_id" character varying(16) NOT NULL, "item_ref" character varying(80) NOT NULL, "kind" character varying(10) NOT NULL, "name" character varying(120) NOT NULL, "unit_price" integer NOT NULL, "monthly" integer NOT NULL DEFAULT '0', "qty" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_145532db85752b29c57d2b7b1f" ON "order_items"  ("order_id") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_145532db85752b29c57d2b7b1f"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a922b820eeef29ac1c6800e826"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "faqs"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "plans"`);
    }

}
