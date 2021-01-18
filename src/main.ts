import { Aurelia } from 'aurelia-framework'
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { create } from "rxjs-spy";
import DevToolsPlugin from 'rxjs-spy-devtools-plugin';

export function configure(aurelia: Aurelia) {
  const spy = create();
  const devtoolsPlugin = new DevToolsPlugin(spy, {
    verbose: false,
  });
  spy.plug(devtoolsPlugin);

  aurelia.use
    .basicConfiguration().history()
    .globalResources(PLATFORM.moduleName('core/observe'))
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('shell')));
}
