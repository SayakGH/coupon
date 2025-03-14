import { ObjectId } from 'mongodb';

export interface Claim {
  _id?: ObjectId;
  couponId: ObjectId;
  ipAddress: string;
  userAgent: string;
  cookieId: string;
  claimedAt: Date;
}