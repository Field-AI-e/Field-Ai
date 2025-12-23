import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pest } from "src/entities/pest.entity";
import { Repository } from "typeorm";
import { ElasticService } from "../elastic/elastic.service";
import { GeminiServiceService } from "./gemini.service";
const Fuse = require('fuse.js');
@Injectable()
export class PestsService {
    private pests: Pest[] = [];
    constructor(
        @InjectRepository(Pest)
        private pestRepository: Repository<Pest>,
    ) {
        this.initPests();

    }

    async initPests(){
        this.pests = await this.pestRepository.find();
    }
    async getPests(){
        return this.pests;
    }
}