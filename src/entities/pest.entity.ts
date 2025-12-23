import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pests')
export class Pest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // “Early Blight”, “Fall Armyworm”

  @Column({ nullable: true })
  type: string; // "fungus" | "insect" | "virus" | etc.

  @Column({ nullable: true })
  imageUrl: string;
}
