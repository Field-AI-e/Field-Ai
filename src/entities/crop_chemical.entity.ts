import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Crop } from "./crop.entity";
import { Chemical } from "./chemicals.entity";

@Entity('crop_products')
export class CropProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Crop, crop => crop.id)
    crop: Crop;

    @ManyToOne(() => Chemical, chemical => chemical.id)
    chemical: Chemical;
}
