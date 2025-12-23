import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pest } from "./pest.entity";
import { Chemical } from "./chemicals.entity";

@Entity('chemical_pests')
export class ChemicalPest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chemical, chemical => chemical.id)
  chemical: Chemical;

  @ManyToOne(() => Pest, pest => pest.id)
  pest: Pest;
}
