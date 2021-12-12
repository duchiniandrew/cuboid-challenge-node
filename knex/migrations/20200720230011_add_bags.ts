import { Knex } from 'knex';
import { Bag } from '../../src/models';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(Bag.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.string('title');
    table.integer('volume').defaultTo(0);
    table.integer('payloadVolume').defaultTo(0);
    table.integer('availableVolume').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(Bag.tableName);
