import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Indexes for the order and product screens:
 *  - "my orders" and a customer's order list (user + newest first), and the admin list filtered by status
 *  - a product's sales / recent orders (order_items by item_ref)
 *  - the admin search boxes (ILIKE '%text%') on orders, products and customers, through pg_trgm
 */
export class AddOrderProductSearchIndexes1794580000000 implements MigrationInterface {
    name = 'AddOrderProductSearchIndexes1794580000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_orders_user_created" ON "orders" ("user_id", "created_at" DESC)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_orders_status_created" ON "orders" ("status", "created_at" DESC)`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_order_items_item_ref" ON "order_items" ("item_ref")`);

        // pg_trgm makes '%text%' searches use an index. Some hosts don't allow the extension — then the searches simply stay as they were.
        await queryRunner.query(`DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS pg_trgm; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'pg_trgm not available: %', SQLERRM; END $$`);
        const [{ ok }] = await queryRunner.query(`SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') AS ok`);
        if (!ok) return;
        const trgm: [string, string, string][] = [
          ["orders", "id", "IDX_orders_id_trgm"], ["orders", "contact_name", "IDX_orders_contact_name_trgm"], ["orders", "contact_phone", "IDX_orders_contact_phone_trgm"],
          ["devices", "name", "IDX_devices_name_trgm"], ["devices", "id", "IDX_devices_id_trgm"],
          ["users", "name", "IDX_users_name_trgm"], ["users", "email", "IDX_users_email_trgm"], ["users", "phone", "IDX_users_phone_trgm"],
        ];
        for (const [table, col, name] of trgm) await queryRunner.query(`CREATE INDEX IF NOT EXISTS "${name}" ON "${table}" USING gin ("${col}" gin_trgm_ops)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const n of ["IDX_users_phone_trgm", "IDX_users_email_trgm", "IDX_users_name_trgm", "IDX_devices_id_trgm", "IDX_devices_name_trgm", "IDX_orders_contact_phone_trgm", "IDX_orders_contact_name_trgm", "IDX_orders_id_trgm",
          "IDX_order_items_item_ref", "IDX_orders_status_created", "IDX_orders_user_created"]) await queryRunner.query(`DROP INDEX IF EXISTS "${n}"`);
    }
}
