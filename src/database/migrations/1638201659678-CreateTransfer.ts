import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class CreateTransfer1638201659678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("statements",new TableColumn({
            name: "sender_id",
            type: "uuid",
            isNullable: true
        }));

        const foreignKey = new TableForeignKey({
            columnNames: ["sender_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
            name:"sender_statement"
        });
        await queryRunner.createForeignKey("statements", foreignKey);

      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("statements","sender_statement");
        await queryRunner.dropColumn("statements","sender_id");
      }
    
    }
    


