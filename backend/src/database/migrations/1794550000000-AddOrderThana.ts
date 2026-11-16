import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderThana1794550000000 implements MigrationInterface {
    name = 'AddOrderThana1794550000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "thana" character varying(60)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "thana"`);
    }
}
