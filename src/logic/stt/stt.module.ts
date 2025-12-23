import { forwardRef, Module } from '@nestjs/common';
import { GeminiServiceService } from '../agent/gemini.service';
import { ElevenLabsService } from './elevenlabs.service';
import { SttGateway } from './stt.gateway';
import { AgentModule } from '../agent/agent.module';

@Module({
    imports: [ 
        forwardRef(() => AgentModule),  
    ],
    controllers: [],
    providers: [GeminiServiceService, ElevenLabsService, SttGateway],
    exports: [GeminiServiceService, ElevenLabsService, SttGateway],
})
export class SttModule {}
