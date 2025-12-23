import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('chemicals')
export class Chemical {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // “Mancozeb 80WP”

  @Column()
  labelLink: string; // PDF link

  @Column({ nullable: true, type: 'text' })
  activeIngredient: string;

  @Column({type: 'text', nullable: true })
  type?: any;

  @Column({ nullable: true })
  formulation: string; // “WP”, “EC”, etc.

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ type: 'json', nullable: true })
  metadata: any; // Anything extra
}
