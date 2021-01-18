import { autoinject } from 'aurelia-framework';
import { History } from 'aurelia-history';
import { RouteRecognizer, ConfigurableRoute } from 'aurelia-route-recognizer';
import { shareProxy } from 'core/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { shareReplay } from 'rxjs/operators';

@autoinject
export class Router<T> {
  private recognizer: RouteRecognizer;
  private data: { [key: string]: T } = {}
  private route = new ReplaySubject<NavigatedRoute<T>>(1);
  route$: Observable<NavigatedRoute<T>> = this.route.pipe(tag('route'), shareProxy());

  constructor(private history: History) {
    this.recognizer = new RouteRecognizer();
  }

  initialize() {
    this.history.activate({
      routeHandler: (fragment: string) => this.urlChanged(fragment.toLowerCase()),
      pushState: true
    });
  }

  addRoute<U extends object>(config: RouteConfig<T>) {
    if (Array.isArray(config.path)) {
      config.path.forEach(x => this.addRoute({ ...config, path: x }));
      return;
    }
    const path = config.path == null ? config.name : config.path;
    const route = new Route<T, U>(this, config.name);
    const configurableRoute: ConfigurableRoute = { path, handler: { name: config.name }, caseSensitive: false };
    this.data[config.name] = config.data;
    this.recognizer.add(configurableRoute);
    return route;
  }

  private async urlChanged(fragment: string) {
    const recognizedRoutes = this.recognizer.recognize(fragment);
    if (!recognizedRoutes || !recognizedRoutes.length) {
      //404
      throw 'No route found!';
    }

    const { handler: { name }, params } = recognizedRoutes[0];
    const data = this.data[name];
    const route = { name, ...params, ...data };
    this.route.next(route);
  }

  navigate(fragment: string) {
    this.history.navigate(fragment);
  }

  navigateToRoute<U extends object>(route: Route<T, U>, params: U) {
    const fragment = this.recognizer.generate(route.name, params);
    this.navigate(fragment);
  }
}

export type RouteConfig<T> = {
  name: string;
  path?: string | string[];
  data?: T;
}

export class Route<T, U extends object> {
  constructor(private router: Router<T>, public name: string) { }

  navigate(params?: U) {
    this.router.navigateToRoute(this, params);
  }
}

export type NavigatedRoute<T> = { name: string } & T;
