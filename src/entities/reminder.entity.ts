import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Conversation } from "./conversation.entity";

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  title: string;


  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  remindAt: Date;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Conversation, conversation => conversation.id)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
