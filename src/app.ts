import { autoinject } from 'aurelia-framework';
import { List as ItemList } from 'items/list';
import { Home } from 'home';
import { Details as ItemDetails } from 'items/details';
import { Navigating, navigates } from 'core/navigating';
import { of, combineLatest, Observable } from 'rxjs';
import { map, tap, switchMap, shareReplay } from 'rxjs/operators';
import { AppRouter } from 'core/app-router';
import { About } from 'about';

@autoinject
export class App {
  activeItem$: Observable<Home | About | ItemList | ItemDetails>;

  constructor(private router: AppRouter, navigating: Navigating, home: Home, about: About, items: ItemList, item: ItemDetails) {
    const viewModel$ = router.route$.pipe(
      tap(_ => !Boolean(sessionStorage.getItem('token')) && router.login.navigate()),
      map(x => x.name === 'home' ? home : x.name === 'about' ? about : x.name === 'items' ? items : item),
      shareReplay()
    );
    const navigating$ = viewModel$.pipe(switchMap(x => navigates(x) ? x.navigating$ : of(false)));
    this.activeItem$ = combineLatest([navigating$, viewModel$]).pipe(map(([x, y]) => x ? navigating : y));
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.login.navigate();
  }
}  
