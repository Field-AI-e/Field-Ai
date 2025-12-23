import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SttModule } from './logic/stt/stt.module';
import { AgentController } from './logic/agent/agent.controller';
import { AgentService } from './logic/agent/agent.service';
import { AgentModule } from './logic/agent/agent.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from './logic/conversation/conversation.controller';
import { ConversationService } from './logic/conversation/conversation.service';
import { ConversationModule } from './logic/conversation/conversation.module';
import { AuthModule } from './logic/auth/auth.module';
import { AuthController } from './logic/auth/auth.controller';
import { ElasticService } from './logic/elastic/elastic.service';
import { ElasticModule } from './logic/elastic/elastic.module';
import { DataProcessing } from './logic/agent/data-processing';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { WebController } from './logic/web/web.controller';
import { WebService } from './logic/web/web.service';
import { WebModule } from './logic/web/web.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), 'voice'), // path to voice folder
      serveRoot: '/voice', // URL prefix for voice files
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), 'uploads', 'images'), // path to images folder
      serveRoot: '/images', // URL prefix for image files
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'farm_voice_ai'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
      }), 
      inject: [ConfigService],
    }),
    SttModule, AgentModule, ConversationModule, AuthModule, ElasticModule, WebModule],
  controllers: [AppController, AgentController, ConversationController,AuthController, WebController],
  providers: [AppService, AgentService,ElasticService, WebService],
})
export class AppModule { }
