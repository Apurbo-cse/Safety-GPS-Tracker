import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderPostcode1794560000000 implements MigrationInterface {
    name = 'AddOrderPostcode1794560000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "postcode" character varying(10)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "postcode"`);
    }
}
