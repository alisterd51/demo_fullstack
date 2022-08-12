import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Player {
    @PrimaryColumn()
    id: number = 0;

    @Column()
    name: string = '';

    @Column()
    salary: number = 0;

    @Column()
    age: number = 0;
}
