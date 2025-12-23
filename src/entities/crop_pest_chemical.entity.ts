import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Crop } from "./crop.entity";
import { Pest } from "./pest.entity";
import { Chemical } from "./chemicals.entity";

@Entity('crop_product_pest')
export class CropProductPest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Crop)
  crop: Crop;

  @ManyToOne(() => Pest)
  pest: Pest;

  @ManyToOne(() => Chemical)
  chemical: Chemical;

  @Column({ nullable: true })
  dosage: string; // 3g per liter etc.

  @Column({ nullable: true })
  frequency: string; // e.g., “7 days”

  @Column({ nullable: true })
  phi: string; // Pre-Harvest Interval

  @Column({ type: 'json', nullable: true })
  safetyNotes: any;

  @Column({ type: 'json', nullable: true })
  mixingInstructions: any;

  @Column({ type: 'json', nullable: true })
  metadata: any; // Optional: PDF text chunks or extra info
}
 