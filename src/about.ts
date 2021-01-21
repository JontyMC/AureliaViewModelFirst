import { One } from 'one';
import { Two } from 'two';
import { autoinject} from 'aurelia-framework';
@autoinject
export class About {
  s = true;
  test;

  constructor(private one: One, private two: Two) {
  }

  t() {
    if (this.s) {
      this.s = false;
      this.test = this.two;
    } else {
      this.s = true;
      this.test = this.one;
    }
  }
}
