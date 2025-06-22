import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface IBorrowModel extends Model<IBorrow> {
  getSummary(): Promise<
    {
      book: { title: string; isbn: string };
      totalQuantity: number;
    }[]
  >;
}
