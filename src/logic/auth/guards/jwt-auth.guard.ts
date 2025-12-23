import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Log for debugging
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    
    if (err || !user) {
      console.error('JWT Auth Guard Error:', {
        err: err?.message,
        info: info?.message,
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader?.substring(0, 20),
      });
      throw err || new UnauthorizedException('Authentication failed');
    }
    
    return user;
  }
}
