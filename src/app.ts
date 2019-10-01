import { Login } from 'auth/login';
import { AppShell } from 'app-shell';
import { AppRouter } from 'core/app-router';
import { History } from 'aurelia-history';
import { autoinject } from 'aurelia-framework';
import { Router, NavigatedRoute } from 'core/router';
import { AuthShell } from 'auth/auth-shell';
import { Home } from 'home';

@autoinject
export class App {
  activeItem: AppShell | AuthShell;
  router: Router;
  appRouter: AppRouter;
  activatedRoute: NavigatedRoute;

  constructor(history: History) {
    this.router = new Router(history, x => this.activateItem(x));
    this.appRouter = new AppRouter(this.router)
  }

  activate() {
    this.router.activate();
  }

  async activateItem(route: NavigatedRoute): Promise<void> {
    const activatedRouteName = this.activatedRoute && this.activatedRoute.name;
    if (this.isAuth(route.name)) {
      const authConductor = this.activatedRoute && this.isAuth(activatedRouteName) ? <AuthShell>this.activeItem : new AuthShell();
      if (!this.isAuth(activatedRouteName)) {
        await authConductor.activate();
        const login = new Login(this.router);
        await login.activate();
        authConductor.activeItem = login;
      }
      this.activeItem = authConductor;
      this.activatedRoute = route;
    } else {
      if (!Boolean(sessionStorage.getItem('token'))) {
        return this.appRouter.login.navigate();
      }
      const appConductor = this.activatedRoute && !this.isAuth(activatedRouteName) ? <AppShell>this.activeItem : new AppShell(this.appRouter);
      if (this.isAuth(activatedRouteName)) {
        await appConductor.activate();
      }
      const appActivatedRouteName = appConductor.activatedRoute && appConductor.activatedRoute.name;
      if (route.name === '' || route.name === 'home') {
        const home = appActivatedRouteName === '' || appActivatedRouteName === 'home' ? <Home>appConductor.activeItem : new Home();
        if (appActivatedRouteName === '' || appActivatedRouteName === 'home') {
          await appConductor.activate();
        }
        appConductor.activeItem = home;
      }
      this.activeItem = appConductor;
      this.activatedRoute = route;
    }
  }

  isAuth(name: string) {
    return name === 'login';
  }
}
