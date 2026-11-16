import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderArea1794530000000 implements MigrationInterface {
    name = 'AddOrderArea1794530000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "area" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "area"`);
    }
}
