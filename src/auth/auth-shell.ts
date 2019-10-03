import { AppRouter } from 'core/app-router';
import { ForgotPassword } from './forgot-password';
import { Login } from './login';
import { autoinject } from 'aurelia-framework';
import { RouteContext } from 'core/router';
import { RouteData } from 'app';

@autoinject
export class AuthShell {
  activeItem: Login | ForgotPassword;

  constructor(private router: AppRouter) {}

  async onNavigated(context: RouteContext<RouteData>): Promise<void> {
    const route = context.route.name;
    if (!context.activatedRoute || context.activatedRoute.name !== route) {
      this.activeItem = route === 'forgot-password' ? new ForgotPassword() : new Login(this.router);
    }
  }
}
