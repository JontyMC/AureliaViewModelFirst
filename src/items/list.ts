import { autoinject } from 'aurelia-framework';
import { AppRouter } from 'core/app-router';
import { ViewModel } from 'core/observe';
import { Observable } from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, map, filter, delay, tap } from 'rxjs/operators';

@autoinject
export class List implements ViewModel {
  private itemIdRegex = /people\/(\d+)/;
  data$: Observable<object>;
  
  constructor(router: AppRouter) {
    const items$ = router.route$.pipe(
      filter(x => x.name === 'items'),
      tag('items list'),
      switchMap(_ =>
        fromFetch('https://swapi.dev/api/people').pipe(
          switchMap(x => x.json()),
          map((x: any): Item[] => x.results.map(y => {
            const matches = y.url.match(this.itemIdRegex);
            return { id: matches[1], name: y.name };
          }))
        )
      ),
      tap(x => console.log('item load', x)),
      delay(2000)
    );
    this.data$ = items$.pipe(map(x => ({ items: x })));
  }
}

interface Item {
  id: string;
  name: string;
}
