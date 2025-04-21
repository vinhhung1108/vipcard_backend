import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatToTimezone } from '../helpers/time.helper';

function transformDates(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(transformDates);
  }

  if (obj && typeof obj === 'object') {
    const transformed: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value instanceof Date) {
        transformed[key] = formatToTimezone(value);
      } else if (typeof value === 'object') {
        transformed[key] = transformDates(value);
      } else {
        transformed[key] = value;
      }
    }
    return transformed;
  }

  return obj;
}

@Injectable()
export class TransformDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => transformDates(data)));
  }
}
