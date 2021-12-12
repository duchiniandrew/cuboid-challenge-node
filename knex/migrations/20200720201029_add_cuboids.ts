import { Bag, Cuboid } from '../../src/models';
import { Knex } from 'knex';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(Cuboid.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.integer('width').notNullable().defaultTo(0);
    table.integer('height').notNullable().defaultTo(0);
    table.integer('depth').notNullable().defaultTo(0);
    table.integer('volume').notNullable().defaultTo(0);
    table.integer('bagId');
    table.foreign('bagId').references('id').inTable(Bag.tableName);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(Cuboid.tableName);
