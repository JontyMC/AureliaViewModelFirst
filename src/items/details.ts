import { items, Item } from 'core/items';

export class Details {
  item: Item;

  async activate2(params: DetailsParams) {
    this.item = items.find(x => x.id === params.id);
    return new Promise(x => setTimeout(() => x(), 3000));
  }
}

export interface DetailsParams {
  id: string;
}
