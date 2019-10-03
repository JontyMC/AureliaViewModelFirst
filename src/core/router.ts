import { History } from 'aurelia-history';
import { RouteRecognizer } from 'aurelia-route-recognizer';
import { RouteData } from 'app';

export class Router<T> {
  private recognizer: RouteRecognizer;
  private activatedRoute: NavigatedRoute<T>

  constructor(private history: History, private routeChangedHandler: (context: RouteContext<T>) => Promise<void>) {
    this.recognizer = new RouteRecognizer();
  }

  activate() {
    this.history.activate({
      routeHandler: (fragment: string) => this.urlChanged(fragment.toLowerCase()),
      pushState: true
    });
  }

  addParameterizedRoute<U extends object>(config: RouteConfig<T>) {
    const route = this.addRoute(config);
    return new ParameterizedRoute<T, U>(route);
  }

  addRoute(config: RouteConfig<T>) {
    if (Array.isArray(config.path)) {
      config.path.forEach(x => this.addRoute({ ...config, path: x }));
      return;
    }
    const path = config.path == null ? config.name : config.path;
    const route = new Route(this, config.name);
    const configurableRoute = { path, handler: { name: config.name, data: config.data }, caseSensitive: false };
    this.recognizer.add(configurableRoute);
    return route;
  }

  private async urlChanged(fragment: string) {
    const recognizedRoutes = this.recognizer.recognize(fragment);
    if (!recognizedRoutes || !recognizedRoutes.length) {
      //404
      throw 'No route found!';
    }

    const route = recognizedRoutes[0];
    //todo: cancellation
    const context = {
      route: {
        name: route.handler.name,
        params: route.params,
        data: (<any>route.handler).data
      },
      activatedRoute: this.activatedRoute
    };
    await this.routeChangedHandler(context);
    this.activatedRoute = context.route;
  }

  navigate(fragment: string) {
    this.history.navigate(fragment);
  }

  navigateToRoute(route: Route<T>, params: object) {
    const fragment = this.recognizer.generate(route.name, params);
    this.history.navigate(fragment);
  }
}

export interface RouteConfig<T> {
  name: string;
  path?: string | string[];
  data?: T;
}

export interface RouteContext<T> {
  route: NavigatedRoute<T>;
  activatedRoute?: NavigatedRoute<T>;
}

export class Route<T> {
  constructor(private router: Router<T>, public name: string) {}

  navigate(params?: object) {
    this.router.navigateToRoute(this, params);
  }
}

export class ParameterizedRoute<T, U extends object> {
  constructor(private route: Route<T>) {}

  navigate(params: U) {
    this.route.navigate(params);
  }
}

export interface NavigatedRoute<T> {
  name: string;
  params: any;
  data: T;
}

export interface Activatable {
  activate2(params: object): Promise<any>;
}

export function isActivatable(object: any): object is Activatable {
  return (object as Activatable).activate2 !== undefined;
}
