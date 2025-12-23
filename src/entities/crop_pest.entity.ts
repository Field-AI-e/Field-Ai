import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Crop } from "./crop.entity";
import { Pest } from "./pest.entity";

@Entity('crop_pests')
export class CropPest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Crop, crop => crop.id)
  crop: Crop;

  @ManyToOne(() => Pest, pest => pest.id)
  pest: Pest;
}
