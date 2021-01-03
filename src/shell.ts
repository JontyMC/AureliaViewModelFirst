import { App } from 'app';
import { autoinject, Container } from 'aurelia-framework';
import { Auth } from 'auth/auth';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { AppRouter } from 'core/app-router';

@autoinject
export class Shell {
  activeItem$: Observable<App | Auth>;

  constructor(private router: AppRouter, container: Container) {
    this.activeItem$ = router.route$.pipe(
      map(x => x.isAuth),
      distinctUntilChanged(),
      tap(x => console.log('shell', 1, x)),
      map(x => x ? container.get(Auth) : container.get(App))
    );
  }

  activate() {
    this.router.initialize();
  }
}
