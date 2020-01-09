import { items, Item } from 'core/items';
import { Activatable } from '../core/router';

export class Details implements Activatable {
  item: Item;

  async onActivation(params: DetailsParams) {
    this.item = items.find(x => x.id === params.id);
    return new Promise(x => setTimeout(() => x(), 3000));
  }
}

export interface DetailsParams {
  id: string;
}
