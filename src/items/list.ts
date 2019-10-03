import { items, Item } from 'core/items';

export class List {
  items: Item[];
  
  activate2() {
    this.items = items;
    return new Promise(x => setTimeout(() => x(), 3000));
  }
}
