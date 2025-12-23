import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
  } from 'typeorm';
import { Conversation } from './conversation.entity';
  
  export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager',
  }
  
  @Entity('user')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    // Basic Auth Fields
    @Column({ unique: true })
    email: string;
  
    @Column()
    passwordHash: string;
  
    @Column({ default: false })
    emailVerified: boolean;
  
    @Column({ nullable: true })
    otpCode: string;
  
    @Column({ type: 'datetime', nullable: true })
    otpExpiresAt: Date;
  
    // User Profile Fields
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;
  
    @Column({ default: true })
    isActive: boolean;
    // Farm profile
    @Column({ nullable: true })
    farmName: string;
  
    @Column({ nullable: true })
    mainCrop: string;
  
    @Column({ type: 'float', nullable: true })
    farmSizeHectares: number;
  
    // Location for weather
    @Column({ type: 'float', nullable: true })
    latitude: number;
  
    @Column({ type: 'float', nullable: true })
    longitude: number;
  
    @Column({ nullable: true })
    locationName: string; // e.g., "Limpopo, SA"
  
    // User Preferences
    @Column({ default: false })
    organicOnly: boolean;
  
    @Column({ default: true })
    voiceModeEnabled: boolean;
  
    @OneToMany(() => Conversation, conversation => conversation.user)
    conversations: Conversation[];
  
    // Meta
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  