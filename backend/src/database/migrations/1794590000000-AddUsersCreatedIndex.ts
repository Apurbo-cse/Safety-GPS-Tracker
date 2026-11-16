import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersCreatedIndex1794590000000 implements MigrationInterface {
    name = 'AddUsersCreatedIndex1794590000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_users_created_at" ON "users" ("created_at" DESC)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_created_at"`);
    }
}
