import { AppRouter, RouteData } from 'core/app-router';
import { ForgotPassword } from './forgot-password';
import { Login } from './login';
import { autoinject } from 'aurelia-framework';
import { RouteContext } from 'core/router';

@autoinject
export class Auth {
  activeItem: Login | ForgotPassword;

  constructor(private router: AppRouter) {}

  async onNavigating(context: RouteContext<RouteData>): Promise<void> {
    const route = context.newRoute.name;
    if (!context.currentRoute || context.currentRoute.name !== route) {
      this.activeItem = route === 'forgot-password' ? new ForgotPassword() : new Login(this.router);
    }
  }
}
