import { AppRouter } from 'core/app-router';

export class Login {
  constructor(private router: AppRouter) { }
  
  login() {
    sessionStorage.setItem('token', 'my-special-auth-token');
    const fragment = sessionStorage.getItem('fragment') || '/';
    this.router.navigate(fragment);
  }
}
 