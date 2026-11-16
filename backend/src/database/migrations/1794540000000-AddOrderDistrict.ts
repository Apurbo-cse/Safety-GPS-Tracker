import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderDistrict1794540000000 implements MigrationInterface {
    name = 'AddOrderDistrict1794540000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "district" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_district" character varying(40)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_district"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "district"`);
    }
}
