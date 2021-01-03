import { autoinject } from 'aurelia-framework';
import { Router, RouteConfig } from 'core/router';
import { DetailsParams } from 'items/details';

@autoinject
export class AppRouter extends Router<RouteData> {
  login = this.add({ name: 'login' }, true);
  forgotPassword = this.add({ name: 'forgot-password' }, true);
  home = this.add({ name: 'home', path: ['', 'home'] });
  about = this.add({ name: 'about' });
  items = this.add({ name: 'items' });
  item = this.add<DetailsParams>({ name: 'item', path: 'items/:id' });

  private add<T extends object>(config: RouteConfig<RouteData>, isAuth?: boolean) {
    config.data = { isAuth: Boolean(isAuth) };
    return this.addRoute<T>(config);
  }
}

export interface RouteData {
  isAuth: boolean;
}
