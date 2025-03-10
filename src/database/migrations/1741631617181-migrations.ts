import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741631617181 implements MigrationInterface {
    name = 'Migrations1741631617181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_727d9c30d77d3a253177b2e918f"`);
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_727d9c30d77d3a253177b2e918f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_727d9c30d77d3a253177b2e918f"`);
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_727d9c30d77d3a253177b2e918f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
