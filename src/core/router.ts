import { History } from 'aurelia-history';
import { RouteRecognizer, ConfigurableRoute } from 'aurelia-route-recognizer';

export class Router {
  private recognizer: RouteRecognizer;

  constructor(private history: History, private routeChangedHandler: (route: NavigatedRoute) => Promise<void>) {
    this.recognizer = new RouteRecognizer();
  }

  activate() {
    this.history.activate({
      routeHandler: (fragment: string) => this.urlChanged(fragment.toLowerCase()),
      pushState: true
    });
  }

  addRoute(config: RouteConfig) {
    if (Array.isArray(config.path)) {
      config.path.forEach(x => this.addRoute({ ...config, path: x }));
      return;
    }
    const path = config.path || config.name;
    const route = new Route(this, config.name);
    const configurableRoute: ConfigurableRoute = { path, handler: { name: config.name }, caseSensitive: false };
    this.recognizer.add(configurableRoute);
    return route;
  }

  private urlChanged(fragment: string) {
    fragment = fragment === '/' ? '' : fragment;
    const recognizedRoutes = this.recognizer.recognize(fragment);
    if (!recognizedRoutes || !recognizedRoutes.length) {
      //404
      return;
    }

    const route = recognizedRoutes[0];
    //todo: cancellation
    return this.routeChangedHandler({
      name: route.handler.name,
      params: route.params
    });
  }

  navigate(fragment: string) {
    this.history.navigate(fragment);
  }

  navigateToRoute(route: Route) {
    const fragment = this.recognizer.generate(route.name, route.params);
    this.history.navigate(fragment);
  }
}

export interface RouteConfig {
  name: string;
  path?: string | string[];
}

export class Route {
  params: object;

  constructor(private router: Router, public name: string) {}

  navigate() {
    this.router.navigateToRoute(this);
  }
}

export class TypedRoute<T> {
  navigate() {

  }
}

export interface NavigatedRoute {
  name: string;
  params: object;
}
