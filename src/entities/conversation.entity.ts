import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './messages.entity';
import { Reminder } from './reminder.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @Column({ nullable: true })
    title: string; // optional auto-generated summary

    @Column({ default: false })
    archived: boolean;

    @Column({ type: 'json', nullable: true })
    contextFrame: any;
    // snapshot of working memory at the end of the session

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @OneToMany(() => Reminder, reminder => reminder.conversation)
    reminders: Reminder[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
