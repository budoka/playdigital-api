import { MigrationInterface, QueryRunner } from 'typeorm';
import { hashPassword } from 'src/utils/crypto';

export class Base1578804765361 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS uuid_v4;`);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await queryRunner.query(`TRUNCATE TABLE currency;`);
    await queryRunner.query(`TRUNCATE TABLE user;`);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);

    await queryRunner.query(`
        CREATE FUNCTION uuid_v4()
            RETURNS CHAR(36)
            READS SQL DATA
            DETERMINISTIC
        BEGIN
            -- 1th and 2nd block are made of 6 random bytes
            SET @h1 = HEX(RANDOM_BYTES(4));
            SET @h2 = HEX(RANDOM_BYTES(2));

            -- 3th block will start with a 4 indicating the version, remaining is random
            SET @h3 = SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3);

            -- 4th block first nibble can only be 8, 9 A or B, remaining is random
            SET @h4 = CONCAT(HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64)+8),
                        SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3));

            -- 5th block is made of 6 random bytes
            SET @h5 = HEX(RANDOM_BYTES(6));

            -- Build the complete UUID
            RETURN LOWER(CONCAT(
                @h1, '-', @h2, '-4', @h3, '-', @h4, '-', @h5
            ));
        END
    `);

    await queryRunner.query(`
        INSERT INTO currency (id, name, symbol) VALUES
        ('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Peso Argentino', 'ARS'),
        (uuid_v4(), 'Dólar Estadounidense', 'USD'),
        (uuid_v4(), 'Euro', 'EUR');`);

    const data = ['user12345'].map((user, index, array) => {
      const dataHash = hashPassword(user);
      const hash = dataHash.hash;
      const salt = dataHash.salt;
      const item = `'${user}', '${hash}', '${salt}'`;
      return item;
    });

    await queryRunner.query(`
        SET @currencyId := (SELECT id FROM currency WHERE symbol = 'USD' LIMIT 1);`);

    await queryRunner.query(`
        INSERT INTO user (id, firstname, lastname, username, password, salt, currencyId) VALUES
        (uuid_v4(), 'pepe', 'jose', ${data.join()}, @currencyId );`);
  }

  async down(queryRunner: QueryRunner): Promise<any> {}
}
