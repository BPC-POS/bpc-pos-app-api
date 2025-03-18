import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742309626167 implements MigrationInterface {
    name = 'Migrations1742309626167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cec51276d127c44da30cd333a73"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "member_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cec51276d127c44da30cd333a73" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cec51276d127c44da30cd333a73"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "member_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cec51276d127c44da30cd333a73" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "user_id"`);
    }

}
