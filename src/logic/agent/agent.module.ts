import { forwardRef, Module } from '@nestjs/common';
import { GeminiServiceService } from './gemini.service';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { ConversationModule } from '../conversation/conversation.module';
import { WeatherService } from './weather.service';
import { DataProcessing } from './data-processing';
import { ElasticModule } from '../elastic/elastic.module';
import { Crop } from 'src/entities/crop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pest } from 'src/entities/pest.entity';
import { Chemical } from 'src/entities/chemicals.entity';
import { CropProductPest } from 'src/entities/crop_pest_chemical.entity';
import { ChemicalPest } from 'src/entities/chemical_pest.entity';
import { CropProduct } from 'src/entities/crop_chemical.entity';
import { CropPest } from 'src/entities/crop_pest.entity';
import { ChemicalService } from './chemical.service';
import { SttModule } from '../stt/stt.module';
import { AuthModule } from '../auth/auth.module';
import { PestsService } from './pests.service';
import { CropsService } from './crops.service';
import { ImageService } from './image.service';
import { ImageUpload } from 'src/entities/image.entity';
@Module({
    imports: [
        ConversationModule, 
        forwardRef(() => ElasticModule), 
        TypeOrmModule.forFeature([Crop, Pest, Chemical, 
            CropProductPest, 
            ChemicalPest,
            CropProduct, 
            CropPest,
            Pest,
            ImageUpload
        ]),
        forwardRef(() => SttModule),
        AuthModule
    ],
    controllers: [AgentController],
    providers: [AgentService, GeminiServiceService, WeatherService, DataProcessing, ChemicalService, CropsService, PestsService, ImageService],
    exports: [AgentService, GeminiServiceService, WeatherService, DataProcessing, ChemicalService, CropsService, PestsService, ImageService],
})
export class AgentModule { }
