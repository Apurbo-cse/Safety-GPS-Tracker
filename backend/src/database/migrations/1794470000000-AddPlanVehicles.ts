import { MigrationInterface, QueryRunner } from "typeorm";
import { DEFAULT_PLAN_VEHICLES } from "../../common/vehicles";

export class AddPlanVehicles1794470000000 implements MigrationInterface {
    name = 'AddPlanVehicles1794470000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans" ADD "vehicles" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        // packages that came from the original price list keep the vehicle they were made for
        for (const [id, v] of Object.entries(DEFAULT_PLAN_VEHICLES)) {
            await queryRunner.query(`UPDATE "plans" SET "vehicles" = $1::jsonb WHERE "id" = $2`, [JSON.stringify(v), id]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "vehicles"`);
    }
}
