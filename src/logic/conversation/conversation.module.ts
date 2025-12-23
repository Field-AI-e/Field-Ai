import { forwardRef, Module } from '@nestjs/common';
import { Conversation } from 'src/entities/conversation.entity';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/messages.entity';
import { AgentModule } from '../agent/agent.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation,Message]),
        forwardRef(() => AgentModule),
    ],
    providers: [ConversationService],
    exports: [ConversationService],
})
export class ConversationModule {}
