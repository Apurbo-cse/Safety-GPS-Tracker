import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategories1794397584427 implements MigrationInterface {
    name = 'AddCategories1794397584427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("sort" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying(80) NOT NULL, "name" character varying(80) NOT NULL, "parent_id" character varying(80), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plans" ALTER COLUMN "features" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "specs" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "features" SET DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "settings" SET DEFAULT '{"alerts":{"ignition":true,"geofence":true,"speed":true,"tamper":true,"sos":true,"documents":true,"billing":true},"channels":{"push":true,"sms":true,"email":false},"speedLimit":80,"language":"en","units":"km","twoFactor":false,"marketing":false}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        // Turn the category / sub-category names already used by products into real rows.
        await queryRunner.query(`
            WITH cats AS (
              SELECT category AS name, trim(both '-' from regexp_replace(lower(category), '[^a-z0-9]+', '-', 'g')) AS slug, MIN(sort) AS s
                FROM devices GROUP BY category
            )
            INSERT INTO categories (id, name, parent_id, sort, active)
            SELECT slug, name, NULL, (ROW_NUMBER() OVER (ORDER BY s) - 1)::int, true FROM cats`);
        await queryRunner.query(`
            WITH subs AS (
              SELECT d.subcategory AS name, c.id AS parent,
                     trim(both '-' from regexp_replace(lower(d.subcategory), '[^a-z0-9]+', '-', 'g')) AS slug, MIN(d.sort) AS s
                FROM devices d JOIN categories c ON c.name = d.category AND c.parent_id IS NULL
               GROUP BY d.subcategory, c.id
            )
            INSERT INTO categories (id, name, parent_id, sort, active)
            SELECT left(parent || '-' || slug, 80), name, parent, (ROW_NUMBER() OVER (PARTITION BY parent ORDER BY s) - 1)::int, true FROM subs`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "settings" SET DEFAULT '{"units": "km", "alerts": {"sos": true, "speed": true, "tamper": true, "billing": true, "geofence": true, "ignition": true, "documents": true}, "channels": {"sms": true, "push": true, "email": false}, "language": "en", "marketing": false, "twoFactor": false, "speedLimit": 80}'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "features" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "specs" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "plans" ALTER COLUMN "features" SET DEFAULT '[]'`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
