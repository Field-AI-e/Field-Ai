import { forwardRef, Global, Module } from '@nestjs/common';
import { ElevenLabsService } from './elevenlabs.service';
import { SttGateway } from './stt.gateway';
import { AgentModule } from '../agent/agent.module';

@Global()
@Module({
    imports: [ 
        forwardRef(() => AgentModule),  
    ],
    controllers: [],
    providers: [ElevenLabsService, SttGateway],
    exports: [ElevenLabsService, SttGateway],
})
export class SttModule {}
