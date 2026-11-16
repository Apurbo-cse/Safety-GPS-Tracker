import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderPayments1794520000000 implements MigrationInterface {
    name = 'AddOrderPayments1794520000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_status" character varying(10) NOT NULL DEFAULT 'unpaid'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_id" character varying(64)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_trx_id" character varying(64)`);
        await queryRunner.query(`CREATE INDEX "IDX_orders_payment_id" ON "orders" ("payment_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_orders_payment_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_trx_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_status"`);
    }
}
