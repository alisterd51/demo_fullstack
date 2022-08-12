import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    id: number = 0;

    @Column()
    username: string = '';

    @Column()
    password: string = '';
}
