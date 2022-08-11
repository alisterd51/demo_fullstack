import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Tech {
    @PrimaryColumn()
    id: number;

    @Column()
    technoname: string;

    @Column()
    category: string;

    @Column()
    details: string;
}
