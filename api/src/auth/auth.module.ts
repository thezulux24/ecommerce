import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: (() => {
                const secret = process.env.JWT_SECRET;
                if (!secret) {
                    throw new Error('⚠️  JWT_SECRET no está definido en las variables de entorno. Configúralo en .env antes de iniciar.');
                }
                return secret;
            })(),
            signOptions: { expiresIn: '15m' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
