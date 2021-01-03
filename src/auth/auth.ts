import { AppRouter } from 'core/app-router';
import { ForgotPassword } from './forgot-password';
import { Login } from './login';
import { autoinject, Container } from 'aurelia-framework';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@autoinject
export class Auth {
  activeItem$: Observable<Login | ForgotPassword>;

  constructor(router: AppRouter, container: Container) {
    this.activeItem$ = router.route$.pipe(
      tap(x => console.log('auth')),
      map(x => container.get(x.name === 'forgot-password' ? ForgotPassword : Login))
    );
  }
}
