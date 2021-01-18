import { AppRouter } from 'core/app-router';
import { ViewModel } from 'core/observe';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { filter, map} from 'rxjs/operators';
import { autoinject } from 'aurelia-framework';

@autoinject
export class Home implements ViewModel {
  data = { count: 0 };
  data$: Observable<object>;

  constructor(router: AppRouter) {
    const count$ = timer(0, 1000).pipe(tag('home count'), map(_ => {
      this.data.count = this.data.count + 1;
      return this.data;
    }));
    const route$ = router.route$.pipe(
      tag('home'),
      filter(x => x.name === 'home')
    );
    this.data$ = combineLatest([count$, route$]).pipe(map(([x, y]) => x));
  }
}
