import { List } from 'items/list';
import { AppRouter } from 'core/app-router';
import { Home } from 'home';
import { RouteContext, isActivatable } from 'core/router';
import { RouteData } from 'app';
import { Details } from 'items/details';

export class AppShell {
  activeItem: Home | List | Details;

  constructor(private appRouter: AppRouter) { }
  
  activate(): Promise<any> {
    return;
  }

  async onNavigated(context: RouteContext<RouteData>): Promise<void> {
    if (!Boolean(sessionStorage.getItem('token'))) {
      return this.appRouter.login.navigate();
    }
    const route = context.route.name;
    if (!context.activatedRoute || context.activatedRoute.name !== route) {
      this.activeItem = route === 'items' ? new List() : route === 'item' ? new Details() : new Home();
    }
    if (isActivatable(this.activeItem)) {
      this.activeItem.activate2(context.route.params);
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    this.appRouter.login.navigate();
  }
}  
