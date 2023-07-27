import { ObjectId } from 'mongodb';
import * as zod from 'zod';

export const ParamsWithId = zod.object({
  id: zod
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          return new ObjectId(val);
        } catch (error) {
          return false;
        }
      },
      { message: 'Invalid Object Id found' }
    ),
});

export type ParamsWithId = zod.infer<typeof ParamsWithId>;
