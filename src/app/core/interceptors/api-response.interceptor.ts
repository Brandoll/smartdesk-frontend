import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response';

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as { success?: unknown; message?: unknown; data?: unknown };
  return typeof v.success === 'boolean' && typeof v.message === 'string';
}

function unwrap(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    map((event) => {
      if (!(event instanceof HttpResponse)) return event;
      if (!isApiResponse(event.body)) return event;
      return event.clone({ body: event.body.data });
    }),
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);
      const body = err.error;
      if (isApiResponse(body) && typeof body.message === 'string') {
        return throwError(() => new Error(body.message));
      }
      return throwError(() => err);
    })
  );
}

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => unwrap(req, next);

