import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741638444535 implements MigrationInterface {
    name = 'Migrations1741638444535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tables" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "capacity" integer NOT NULL, "notes" character varying, "status" integer NOT NULL, "area_id" integer, CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "table_areas" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_e388eeb889ae8a7862837f022de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tables" ADD CONSTRAINT "FK_9371712959bf7427eb104769ac6" FOREIGN KEY ("area_id") REFERENCES "table_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tables" DROP CONSTRAINT "FK_9371712959bf7427eb104769ac6"`);
        await queryRunner.query(`DROP TABLE "table_areas"`);
        await queryRunner.query(`DROP TABLE "tables"`);
    }

}
