import { Id, RelationMappings, QueryContext, ModelOptions } from 'objection';
import { Bag } from './Bag';
import Base from './Base';

export class Cuboid extends Base {
  id!: Id;
  width!: number;
  height!: number;
  depth!: number;
  bagId?: Id;
  bag!: Bag;
  volume!: number;

  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    this.volume = this.width * this.height * this.depth;
    await this.updateBag(queryContext);
  }
  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {
    await this.updateBag(queryContext);
  }

  async updateBag(queryContext: QueryContext) {
    await Bag.transaction(async (trx) => {
      if (this.bagId) {
        const bag = await Bag.query(trx).findById(this.bagId).select('availableVolume', 'payloadVolume');
        if (bag && bag.availableVolume >= this.volume) {
          bag.availableVolume -= this.volume;
          bag.payloadVolume += this.volume;
          await Bag.query(trx).update(bag).where({ id: this.bagId });
        } else {
          throw new Error('Insufficient capacity in bag');
        }
      }
    });
  }

  static tableName = 'cuboids';

  static get relationMappings(): RelationMappings {
    return {
      bag: {
        relation: Base.BelongsToOneRelation,
        modelClass: Bag,
        join: {
          from: 'cuboids.bagId',
          to: 'bags.id',
        },
      },
    };
  }
}

export default Cuboid;
