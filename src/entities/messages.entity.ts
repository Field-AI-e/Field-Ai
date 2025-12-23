import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { ImageUpload } from './image.entity';
import { MessageType, Role } from 'src/utils/Role';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, conversation => conversation.id, {
        onDelete: 'CASCADE',
    })
    conversation: Conversation;

    @Column({ type: 'enum', enum: Role })
    role: Role;

    @Column({ type: 'text' })
    content: string; // raw text

    @Column({ type: 'text', nullable: true })
    englishContent: string;

    @Column({ type: 'text', nullable: true })
    originalLanguage: string;

  
    @Column({ type: 'enum', enum: MessageType })
    type: MessageType;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @OneToMany(() => ImageUpload, image => image.message, { cascade: true })
    sources?: ImageUpload[]; // Images attached to this message
   

    @CreateDateColumn()
    createdAt: Date;
}
