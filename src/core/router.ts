import { History } from 'aurelia-history';
import { RouteRecognizer } from 'aurelia-route-recognizer';
import { CancellationTokenSource, CancellationToken } from './cancellation';

export class Router<T> {
  private recognizer: RouteRecognizer;
  private currentRoute: NavigatedRoute<T>
  private tokenSource: CancellationTokenSource;

  constructor(private history: History) {
    this.recognizer = new RouteRecognizer();
  }

  initialize(routeChangedHandler: (context: RouteContext<T>) => Promise<void>) {
    this.history.activate({
      routeHandler: (fragment: string) => this.urlChanged(routeChangedHandler, fragment.toLowerCase()),
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

  private async urlChanged(routeChangedHandler: (context: RouteContext<T>) => Promise<void>, fragment: string) {
    this.tokenSource = new CancellationTokenSource();
    const token = this.tokenSource.token;
    const recognizedRoutes = this.recognizer.recognize(fragment);
    if (!recognizedRoutes || !recognizedRoutes.length) {
      //404
      throw 'No route found!';
    }

    const route = recognizedRoutes[0];
    const context: RouteContext<T> = {
      newRoute: {
        name: route.handler.name,
        params: route.params,
        data: (<any>route.handler).data
      },
      currentRoute: this.currentRoute,
      cancellationToken: token
    };
    await routeChangedHandler(context);
    if (!token.isCancellationRequested) {
      this.currentRoute = context.newRoute;
    }
  }

  navigate(fragment: string) {
    this.tokenSource.cancel();
    this.history.navigate(fragment);
  }

  navigateToRoute(route: Route<T>, params: object) {
    const fragment = this.recognizer.generate(route.name, params);
    this.navigate(fragment);
  }
}

export interface RouteConfig<T> {
  name: string;
  path?: string | string[];
  data?: T;
}

export interface RouteContext<T> {
  newRoute: NavigatedRoute<T>;
  currentRoute?: NavigatedRoute<T>;
  cancellationToken: CancellationToken;
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
  onActivation(params: object): Promise<any>;
}

export function isActivatable(object: any): object is Activatable {
  return (object as Activatable).onActivation !== undefined;
}
