import { App } from 'app';
import { AppRouter, RouteData } from 'core/app-router';
import { History } from 'aurelia-history';
import { autoinject } from 'aurelia-framework';
import { Router, RouteContext } from 'core/router';
import { Auth } from 'auth/auth';

@autoinject
export class Shell {
  activeItem: App | Auth;
  router: Router<RouteData>;
  appRouter: AppRouter;

  constructor(history: History) {
    this.router = new Router<RouteData>(history);
    this.appRouter = new AppRouter(this.router)
  }

  activate() {
    this.router.initialize(x => this.onNavigating(x));
  }

  async onNavigating(context: RouteContext<RouteData>): Promise<void> {
    if (!context.currentRoute || context.currentRoute.data.isAuth !== context.newRoute.data.isAuth) {
      this.activeItem = context.newRoute.data.isAuth ? new Auth(this.appRouter) : new App(this.appRouter);
    }
    await this.activeItem.onNavigating(context);
  }

  isAuth(name: string) {
    return name === 'login';
  }
}
