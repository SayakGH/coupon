import { ObjectId } from 'mongodb';

export interface Coupon {
  _id?: ObjectId;
  code: string;
  description: string;
  active: boolean;
  created: Date;
}

