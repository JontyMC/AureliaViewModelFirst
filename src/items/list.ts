import { items, Item } from 'core/items';
import { Activatable } from '../core/router';

export class List implements Activatable {
  items: Item[];
  
  onActivation() {
    this.items = items;
    return new Promise(x => setTimeout(() => x(), 3000));
  }
}
