import { Record } from "./record";

export interface IRecordRepository {
  create(record: Record): Promise<void>;
  getLastIncrementId(): Promise<number | null>;
}
