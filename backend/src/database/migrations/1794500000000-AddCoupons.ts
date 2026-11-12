import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoupons1794500000000 implements MigrationInterface {
    name = 'AddCoupons1794500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coupons" ("code" character varying(30) NOT NULL, "kind" character varying(10) NOT NULL, "value" integer NOT NULL, "min_total" integer NOT NULL DEFAULT '0', "max_uses" integer, "used" integer NOT NULL DEFAULT '0', "expires_at" TIMESTAMP WITH TIME ZONE, "active" boolean NOT NULL DEFAULT true, "note" character varying(120) NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_coupons_code" PRIMARY KEY ("code"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "discount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "coupon_code" character varying(30)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "coupon_code"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discount"`);
        await queryRunner.query(`DROP TABLE "coupons"`);
    }
}
