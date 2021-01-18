import { autoinject } from 'aurelia-framework';
import { BehaviorSubject } from 'rxjs';

@autoinject
export class Store {
  private state: BehaviorSubject<State> = new BehaviorSubject({

  });
  state$ = this.state.asObservable();

}  

export interface State {

}
