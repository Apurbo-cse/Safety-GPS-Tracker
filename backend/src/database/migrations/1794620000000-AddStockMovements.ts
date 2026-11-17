import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockMovements1794620000000 implements MigrationInterface {
    name = 'AddStockMovements1794620000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_movements" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "device_id" character varying(80) NOT NULL, "delta" integer NOT NULL, "stock_after" integer NOT NULL, "reason" character varying(20) NOT NULL, "damaged" integer NOT NULL DEFAULT 0, "note" character varying(300) NOT NULL DEFAULT '', "order_id" character varying(16), "user_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_stock_movements" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_stock_movements_device" ON "stock_movements" ("device_id", "created_at" DESC)`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "returned_qty" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "returned_qty"`);
        await queryRunner.query(`DROP TABLE "stock_movements"`);
    }
}
