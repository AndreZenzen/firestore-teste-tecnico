import { IRecordRepository } from "../domain/IRecordRepository";
import { Record } from "../domain/record";

export class CreateRecordService {
  constructor(private repository: IRecordRepository) {}

  async execute(name: string): Promise<void> {
    const record = new Record(name);
    record && (await this.repository.create(record));
  }
}
