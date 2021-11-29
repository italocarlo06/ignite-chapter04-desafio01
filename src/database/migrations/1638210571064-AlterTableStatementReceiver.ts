import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterTableStatementReceiver1638210571064 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("statements",new TableColumn({
            name: "receiver_id",
            type: "uuid",
            isNullable: true
        }));

        const foreignKey = new TableForeignKey({
            columnNames: ["receiver_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
            name:"receiver_statement"
        });
        await queryRunner.createForeignKey("statements", foreignKey);

      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("statements","receiver_statement");
        await queryRunner.dropColumn("statements","receiver_id");
      }

}
