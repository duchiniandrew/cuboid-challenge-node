import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import { Bag, Cuboid } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const ids = req.query.ids as Id[];
  const cuboids = await Cuboid.query().findByIds(ids).withGraphFetched('bag');

  return res.status(200).json(cuboids);
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const cuboid = await Cuboid.query().findById(id);

  if (cuboid) {
    cuboid.volume = cuboid.width * cuboid.depth * cuboid.depth;
    return res.status(HttpStatus.OK).json(cuboid);
  }
  return res.sendStatus(HttpStatus.NOT_FOUND);
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId } = req.body;

  const bag = await Bag.query().findById(bagId)
  if (bag) {
    try {
      const cuboid = await Cuboid.query().insert({
        width,
        height,
        depth,
        bagId,
      });
      return res.status(HttpStatus.CREATED).json(cuboid);
    } catch (e) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'Insufficient capacity in bag' });
    }
  }
  return res.sendStatus(HttpStatus.NOT_FOUND).json();
};
export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { width, height, depth, bagId } = req.body;

  try {
    const bag = await Bag.query().findById(bagId)
    if (bag) {
      const volume = width * height * depth
      await Cuboid.query()
        .update({ width: width, height: height, depth: depth, bagId: bagId, volume: volume })
        .where({ id });
      return res.status(HttpStatus.OK).json();
    }
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Bag not found' });
  } catch (error) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json();
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const result = await Cuboid.query().deleteById(id);
  if (!result) {
    return res.status(HttpStatus.NOT_FOUND).json();
  }
  return res.status(HttpStatus.OK).json();
};
