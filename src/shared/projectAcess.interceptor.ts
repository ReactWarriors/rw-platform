import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

// @Interceptor()
// class Interceptor implements NestInterceptor {
//
//   async intercept(context: ExecutionContext, stream$: Observable<any>) {
//     const request = context.switchToHttp().getRequest();
//     console.log('before interceptor', request.params);
//
//     request.params.id = 4;
//
//     console.log('after interceptor', request.params);
//     return stream$;
//   }
// }
