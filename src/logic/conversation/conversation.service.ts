import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/messages.entity';
import { GeminiServiceService } from '../agent/gemini.service';
import { Role } from 'src/utils/Role';

@Injectable()
export class ConversationService {

    constructor(
        @InjectRepository(Conversation)
        private chatRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @Inject(forwardRef(() => GeminiServiceService))
        private readonly geminiService: GeminiServiceService,
    ) { }
    async updateConversation(conversationId: number, arg1: { contextFrame: any; }) {
        // Use save() instead of update() to ensure JSON is properly serialized
        const conversation = await this.chatRepository.findOne({
            where: { id: conversationId }
        });
        if (conversation) {
            conversation.contextFrame = arg1.contextFrame;
            return await this.chatRepository.save(conversation);
        }
        return null;
    }
    async ensureConversation(userId: number, conversationId?: number) {
        if (conversationId) {
            const c = await this.chatRepository.findOne({
                where: {
                    id: conversationId,
                    user: {
                        id: userId
                    }
                }
            });
            if (c) return c;
        }
        return this.chatRepository.save({ user: { id: userId }, title: '' });
    }
    getConversationMessages(conversationId: number) {
        return this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            relations: ['sources'],
        });
    }
    async getConversation(conversationId: number) {
        const conversation = await this.chatRepository.findOne({
            where: { id: conversationId }
        });
        // Ensure contextFrame is properly parsed if it's a string
        if (conversation && conversation.contextFrame && typeof conversation.contextFrame === 'string') {
            try {
                conversation.contextFrame = JSON.parse(conversation.contextFrame);
            } catch (e) {
                console.error('Error parsing contextFrame JSON:', e);
            }
        }
        return conversation;
    }
    async getRecentHistoryAsc(conversationId: number, maxMessages?: number) {
        return this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'ASC' },
            take: maxMessages,
            relations: ['sources'],
        });
    }
    getConversations(userId: number) {
        return this.chatRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    async saveMessage(conversationId: number, message: Message) {
        return this.messageRepository.save({ ...message, conversation: { id: conversationId } });
    }

    async generateAndUpdateTitle(conversationId: number, firstMessageContent: string, userId: number): Promise<Conversation | null> {
        const conversation = await this.chatRepository.findOne({ where: { id: conversationId } });
        if (conversation && (!conversation.title || conversation.title.trim() === '')) {
            try {
                const messages = await this.messageRepository.find({
                    where: { conversation: { id: conversationId } },
                    order: { createdAt: 'ASC' },
                    take: 10,
                });

                const conversationText = messages
                    .map((msg) => {
                        const content = msg.englishContent || msg.content;
                        const role = msg.role === Role.USER ? 'User' : 'Assistant';
                        return `${role}: ${content}`;
                    })
                    .join('\n');

                const titlePrompt = `Based on the following conversation, generate a concise title (maximum 60 characters) that summarizes the main topic or question. Return only the title, nothing else.\n\nConversation:\n${conversationText}`;
                const result = await this.geminiService.generateContentStream(titlePrompt, userId);
                const generatedTitle = result.text?.trim();

                if (generatedTitle) {
                    conversation.title = generatedTitle.substring(0, 60); // Truncate to 60 characters
                    const updatedConversation = await this.chatRepository.save(conversation);
                    console.log(`Generated title for conversation ${conversationId}: ${generatedTitle}`);
                    return updatedConversation;
                }
            } catch (error) {
                console.error(`Error generating title for conversation ${conversationId}:`, error);
            }
        }
        return conversation;
    }
}
