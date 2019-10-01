import { Router, Route } from 'core/router';

export class AppRouter {
  login: Route;
  home: Route;
  
  constructor(router: Router) {
    this.login = router.addRoute({ name: 'login' });
    this.home = router.addRoute({ name: 'home', path: ['', 'home '] });
  }
}
