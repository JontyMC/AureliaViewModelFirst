import { RouteConfig } from './router';
import { DetailsParams } from 'items/details';
import { Router, Route, ParameterizedRoute } from 'core/router';

export class AppRouter {
  login: Route<RouteData>;
  forgotPassword: Route<RouteData>;
  home: Route<RouteData>;
  items: Route<RouteData>;
  item: ParameterizedRoute<RouteData, DetailsParams>;
  
  constructor(private router: Router<RouteData>) {
    this.login = this.addRoute({ name: 'login' }, true);
    this.forgotPassword = this.addRoute({ name: 'forgot-password' }, true);
    this.home = this.addRoute({ name: 'home', path: ['', 'home'] });
    this.items = this.addRoute({ name: 'items' });
    this.item = this.addParameterizedRoute<DetailsParams>({ name: 'item', path: 'items/:id' });
  }

  private addRoute(config: RouteConfig<RouteData>, isAuth?: boolean) {
    config.data = { isAuth: Boolean(isAuth) };
    return this.router.addRoute(config);
  }

  private addParameterizedRoute<T extends object>(config: RouteConfig<RouteData>) {
    config.data = { isAuth: false };
    return this.router.addParameterizedRoute<T>(config);
  }

  navigate(fragment: string) {
    this.router.navigate(fragment);
  }
}

export interface RouteData {
  isAuth: boolean;
}

