import { Types } from "mongoose";

export default interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}
