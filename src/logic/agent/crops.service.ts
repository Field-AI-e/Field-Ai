import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Crop } from "src/entities/crop.entity";
import { Repository } from "typeorm";
import { ElasticService } from "../elastic/elastic.service";
import { GeminiServiceService } from "./gemini.service";
const Fuse = require('fuse.js');
@Injectable()
export class CropsService {
    private crops: Crop[] = [];
    constructor(
        @InjectRepository(Crop)
        private cropRepository: Repository<Crop>,
    ) {
        this.initCrops();

    }
    async initCrops(){
        this.crops = await this.cropRepository.find();
    }
    async getCrops(){
        return this.crops;
    }

    
}