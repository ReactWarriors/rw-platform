import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersTableRenaming1600157482766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('users', 'user');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user', 'users');
  }
}
