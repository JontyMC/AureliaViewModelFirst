import { autoinject } from 'aurelia-framework';
import { AppRouter } from 'core/app-router';
import { Observable, merge } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, tap, map, filter, mapTo, shareReplay } from 'rxjs/operators';

@autoinject
export class List {
  private itemIdRegex = /people\/(\d+)/;
  items$: Observable<Item[]>;
  navigating$: Observable<boolean>;
  
  constructor(router: AppRouter) {
    this.items$ = router.route$.pipe(
      filter(x => x.name === 'items'),
      switchMap(_ =>
        fromFetch('https://swapi.dev/api/people').pipe(
          switchMap(x => x.json()),
          map((x: any): Item[] => x.results.map(y => {
            const matches = y.url.match(this.itemIdRegex);
            return { id: matches[1], name: y.name };
          })),
          tap(x => console.log(x))
        )
      ),
      shareReplay(1)
    );
    this.navigating$ = merge(router.route$.pipe(mapTo(true)), this.items$.pipe(mapTo(false)));
  }
}

interface Item {
  id: string;
  name: string;
}
