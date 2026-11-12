import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStaffPostsBillingStock1794457952922 implements MigrationInterface {
    name = 'AddStaffPostsBillingStock1794457952922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" character varying(80) NOT NULL, "title" character varying(150) NOT NULL, "excerpt" character varying(300) NOT NULL DEFAULT '', "cover" character varying(240), "content" text NOT NULL, "published" boolean NOT NULL DEFAULT false, "published_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_720b257b494a77eebb2f03780b" ON "posts"  ("published") `);
        await queryRunner.query(`CREATE INDEX "IDX_d1313dd89c695e9fc8bd710ab5" ON "posts"  ("published_at") `);
        await queryRunner.query(`CREATE TABLE "staff_roles" ("id" character varying(40) NOT NULL, "name" character varying(60) NOT NULL, "description" character varying(200) NOT NULL DEFAULT '', "permissions" jsonb NOT NULL DEFAULT '[]'::jsonb, "system" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_87101d9c9d1604a36152cfad1c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plans" ADD "description" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "plans" ADD "cost" integer`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "description" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "cost" integer`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "stock" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "staff_role_id" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "disabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "tax_id" character varying(30) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "billing_address" character varying(240) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "billing_division" character varying(40) NOT NULL DEFAULT 'Dhaka'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "billing_postcode" character varying(10) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_name" character varying(120) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_company" character varying(120) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_tax_id" character varying(30) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_address" character varying(240) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_division" character varying(40) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_postcode" character varying(10) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_phone" character varying(11) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_email" character varying(254) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "unit_cost" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        // Built-in staff roles, and every existing admin becomes an Owner (so nobody loses access).
        await queryRunner.query(`
            INSERT INTO staff_roles (id, name, description, permissions, system) VALUES
              ('owner', 'Owner', 'Full access, including staff and roles.', '["orders.view", "orders.manage", "products.manage", "content.manage", "customers.view", "finance.view", "staff.manage"]'::jsonb, true),
              ('manager', 'Manager', 'Runs the shop day to day. Can''t manage staff.', '["orders.view", "orders.manage", "products.manage", "content.manage", "customers.view", "finance.view"]'::jsonb, true),
              ('sales', 'Sales', 'Handles orders and customers.', '["orders.view", "orders.manage", "customers.view"]'::jsonb, true),
              ('support', 'Support', 'Can look up orders and customers, not change them.', '["orders.view", "customers.view"]'::jsonb, true),
              ('content', 'Content editor', 'Writes FAQs, hero slides and news.', '["content.manage"]'::jsonb, true),
              ('inventory', 'Inventory', 'Keeps products, categories and stock up to date.', '["products.manage", "orders.view"]'::jsonb, true)
            ON CONFLICT (id) DO NOTHING`);
        await queryRunner.query(`UPDATE users SET staff_role_id = 'owner' WHERE role = 'admin' AND staff_role_id IS NULL`);
        // Billing for orders placed before billing existed: bill the person named in the order.
        await queryRunner.query(`UPDATE orders SET billing_name = contact_name, billing_address = address, billing_division = division, billing_phone = contact_phone, billing_email = contact_email WHERE billing_name = ''`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "billing_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "billing_address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "billing_division" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "billing_phone" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "billing_email" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "unit_cost"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_email"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_phone"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_postcode"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_division"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_address"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_tax_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_company"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "billing_postcode"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "billing_division"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "billing_address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tax_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "disabled"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "staff_role_id"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "cost"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "cost"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "staff_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1313dd89c695e9fc8bd710ab5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_720b257b494a77eebb2f03780b"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
