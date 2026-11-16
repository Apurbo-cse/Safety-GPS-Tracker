import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderRefundTrx1794600000000 implements MigrationInterface {
    name = 'AddOrderRefundTrx1794600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "payment_refund_trx_id" character varying(64)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_refund_trx_id"`);
    }
}
