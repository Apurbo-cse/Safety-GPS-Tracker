import { MigrationInterface, QueryRunner } from "typeorm";

/** Indexes for the queries the website and admin run most: shop filtering, newest-first order lists, staff lookups. */
export class AddPerformanceIndexes1794490000000 implements MigrationInterface {
    name = 'AddPerformanceIndexes1794490000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_devices_category_sub" ON "devices" ("category", "subcategory")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_devices_active_sort" ON "devices" ("active", "sort")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_orders_created_at" ON "orders" ("created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_staff_role" ON "users" ("staff_role_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_staff_role"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_orders_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_devices_active_sort"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_devices_category_sub"`);
    }
}
