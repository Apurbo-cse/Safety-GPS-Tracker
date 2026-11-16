import { MigrationInterface, QueryRunner } from "typeorm";

/** received -> pending, active -> delivered; "returned" and "refunded" are new. */
export class OrderStatusesPendingDelivered1794570000000 implements MigrationInterface {
    name = 'OrderStatusesPendingDelivered1794570000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`UPDATE "orders" SET "status" = 'pending' WHERE "status" = 'received'`);
        await queryRunner.query(`UPDATE "orders" SET "status" = 'delivered' WHERE "status" = 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "orders" SET "status" = 'active' WHERE "status" IN ('delivered', 'returned', 'refunded')`);
        await queryRunner.query(`UPDATE "orders" SET "status" = 'received' WHERE "status" = 'pending'`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'received'`);
    }
}
