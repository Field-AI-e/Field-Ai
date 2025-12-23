import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';
@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    async getConversations(@Request() req) {
        const { user } = req;
        return this.conversationService.getConversations(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getConversation(@Request() req, @Param('id') id: number) {
        const { user } = req;
        return this.conversationService.getConversationMessages(id);
    }
}
