import { App } from 'app';
import { autoinject, Container } from 'aurelia-framework';
import { Auth } from 'auth/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppRouter } from 'core/app-router';
import { tag } from 'rxjs-spy/cjs/operators';

@autoinject
export class Shell {
  activeItem$: Observable<App | Auth>;

  constructor(private router: AppRouter, container: Container) {
    this.activeItem$ = router.route$.pipe(
      tag('shell'),
      map(x => x.isAuth),
      map(x => x ? container.get(Auth) : container.get(App))
    );
  }

  activate() {
    this.router.initialize();
  }
}
