import { MonoTypeOperatorFunction } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function shareProxy<T>(): MonoTypeOperatorFunction<T> {
  return x => x.pipe();
  //return x => x.pipe(shareReplay(1));
}
