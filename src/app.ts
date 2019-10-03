import { AppShell } from 'app-shell';
import { AppRouter } from 'core/app-router';
import { History } from 'aurelia-history';
import { autoinject } from 'aurelia-framework';
import { Router, RouteContext } from 'core/router';
import { AuthShell } from 'auth/auth-shell';

@autoinject
export class App {
  activeItem: AppShell | AuthShell;
  router: Router<RouteData>;
  appRouter: AppRouter;

  constructor(history: History) {
    this.router = new Router<RouteData>(history, x => this.onNavigated(x));
    this.appRouter = new AppRouter(this.router)
  }

  activate() {
    this.router.activate();
  }

  async onNavigated(context: RouteContext<RouteData>): Promise<void> {
    if (!context.activatedRoute || context.activatedRoute.data.isAuth !== context.route.data.isAuth) {
      this.activeItem = context.route.data.isAuth ? new AuthShell(this.appRouter) : new AppShell(this.appRouter);
    }
    await this.activeItem.onNavigated(context);
  }

  isAuth(name: string) {
    return name === 'login';
  }
}

export interface RouteData {
  isAuth: boolean;
}
