import { autoinject } from 'aurelia-framework';
import { List as ItemList } from 'items/list';
import { Home } from 'home';
import { Details as ItemDetails } from 'items/details';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppRouter } from 'core/app-router';
import { About } from 'about';
import { tag } from 'rxjs-spy/cjs/operators';

@autoinject
export class App {
  activeItem$: Observable<Home | About | ItemList | ItemDetails>;

  constructor(private router: AppRouter, home: Home, about: About, items: ItemList, item: ItemDetails) {
    this.activeItem$ = router.route$.pipe(
      tag('app'),
      tap(_ => !Boolean(sessionStorage.getItem('token')) && router.login.navigate()),
      map(x => x.name === 'home' ? home : x.name === 'about' ? about : x.name === 'items' ? items : item)
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.login.navigate();
  }
}  
