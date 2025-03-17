import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742243245454 implements MigrationInterface {
    name = 'Migrations1742243245454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "variant_id" integer`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "unit_price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "discount" numeric`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_db2d0ea722e16e0fe8ab3bce111" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_db2d0ea722e16e0fe8ab3bce111"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "price" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "unit_price"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "variant_id"`);
    }

}
