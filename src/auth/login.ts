import { autoinject } from 'aurelia-framework';
import { AppRouter } from 'core/app-router';

@autoinject
export class Login {
  constructor(private router: AppRouter) { }
  
  login() {
    sessionStorage.setItem('token', 'my-special-auth-token');
    const fragment = sessionStorage.getItem('fragment') || '/';
    this.router.navigate(fragment);
  }
}
 