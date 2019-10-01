import { Login } from './login';
import { autoinject } from 'aurelia-framework';

@autoinject
export class AuthShell {
  activeItem: Login;

  activate() {}
}
