import { AppRouter } from 'core/app-router';
import { Home } from 'home';
import { NavigatedRoute } from 'core/router';

export class AppShell {
  activatedRoute: NavigatedRoute;
  activeItem: Home;

  constructor(private appRouter: AppRouter) { }
  
  activate(): Promise<any> {
    return;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.appRouter.login.navigate();
  }
}
