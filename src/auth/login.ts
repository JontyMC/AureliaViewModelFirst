import { Router } from 'core/router';

export class Login {
  constructor(private router: Router) { }

  activate() { }
  
  login() {
    sessionStorage.setItem('token', 'my-special-auth-token');
    const fragment = sessionStorage.getItem('fragment') || '';
    this.router.navigate(fragment);
  }
}
