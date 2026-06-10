import { firstValueFrom, type Observable } from 'rxjs';

/** Bridges HttpClient Observables to async/await. RxJS stays in core/api only. */
export function readHttpResource<T>(source: Observable<T>): Promise<T> {
  return firstValueFrom(source);
}
