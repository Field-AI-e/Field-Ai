import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Conversation } from "./conversation.entity";
import { Message } from "./messages.entity";

@Entity('image_uploads')
export class ImageUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Conversation, conversation => conversation.id, { nullable: true })
  conversation: Conversation;

  @ManyToOne(() => Message, message => message.sources, { nullable: true, onDelete: 'SET NULL' })
  message: Message; // Message this image is attached to

  @Column({ unique: true })
  artifactId: string; // UUID for referencing the image

  @Column()
  imageUrl: string; // Public URL to access the image

  @Column()
  localPath: string; // Local file system path

  @Column({ type: 'json', nullable: true })
  visionResult: any; // disease, confidence, notes

  @CreateDateColumn()
  createdAt: Date;
}
