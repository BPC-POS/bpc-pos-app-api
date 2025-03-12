import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741803136973 implements MigrationInterface {
    name = 'Migrations1741803136973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "avatar" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "avatar"`);
    }

}
