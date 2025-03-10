import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741629603992 implements MigrationInterface {
    name = 'Migrations1741629603992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD "member_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_4c960593593bef596cbf61bfa6d" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_4c960593593bef596cbf61bfa6d"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "member_id"`);
    }

}
