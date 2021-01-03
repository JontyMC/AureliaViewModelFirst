import { Observable } from 'rxjs';

export class Navigating {
}

export interface Navigates {
  navigating$: Observable<boolean>; 
}

export function navigates(viewModel: any): viewModel is Navigates {
  return (viewModel as Navigates).navigating$ !== undefined;
}
