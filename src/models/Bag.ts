import { Id, RelationMappings } from 'objection';
import { Cuboid } from './Cuboid';
import Base from './Base';

export class Bag extends Base {
  id!: Id;
  volume!: number;
  title!: string;
  payloadVolume!: number;
  availableVolume!: number;
  cuboids?: Cuboid[] | undefined;

  $beforeInsert(): void {
    this.availableVolume =
      this.volume - (this.payloadVolume ? this.payloadVolume : 0);
  }

  static tableName = 'bags';

  static get relationMappings(): RelationMappings {
    return {
      cuboids: {
        relation: Base.HasManyRelation,
        modelClass: Cuboid,
        join: {
          from: 'bags.id',
          to: 'cuboids.bagId',
        },
      },
    };
  }
}

export default Bag;
