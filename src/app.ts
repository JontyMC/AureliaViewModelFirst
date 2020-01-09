import { List } from 'items/list';
import { AppRouter, RouteData } from 'core/app-router';
import { Home } from 'home';
import { RouteContext, isActivatable } from 'core/router';
import { Details } from 'items/details';
import { Navigating } from 'core/navigating';

export class App {
  activeItem: Home | List | Details | Navigating;

  constructor(private appRouter: AppRouter) { }
  
  activate(): Promise<any> {
    return;
  }

  async onNavigating(context: RouteContext<RouteData>): Promise<void> {
    if (!Boolean(sessionStorage.getItem('token'))) {
      return this.appRouter.login.navigate();
    }
    const route = context.newRoute.name;
    const itemToActivate = !context.currentRoute || context.currentRoute.name !== route
      ? route === 'items' ? new List() : route === 'item' ? new Details() : new Home()
      : this.activeItem;
    if (isActivatable(itemToActivate)) {
      this.activeItem = new Navigating();
      await itemToActivate.onActivation(context.newRoute.params);
    }
    this.activeItem = itemToActivate;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.appRouter.login.navigate();
  }
}  
