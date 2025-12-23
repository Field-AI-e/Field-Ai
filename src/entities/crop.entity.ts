import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('crops')
export class Crop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // “Tomato”, “Maize”

    @Column({ nullable: true })
    imageUrl: string;
}
