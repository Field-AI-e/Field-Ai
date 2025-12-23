import { Module } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({ 
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET', 'your-secret-key'),
            signOptions: {
                expiresIn: configService.get('JWT_EXPIRES_IN', '30d'),
            },
        }),
        inject: [ConfigService],
    }),],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
