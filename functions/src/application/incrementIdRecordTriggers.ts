import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { IRecordRepository } from "../domain/IRecordRepository";

export class IncrementRecordIdTrigger {
  constructor(private readonly repository: IRecordRepository) {}

  async execute(snap: QueryDocumentSnapshot): Promise<void> {
    const record = snap.data();
    if (!record || record.increment_id) return;

    const lastIncrementId = (await this.repository.getLastIncrementId()) || 0;

    await snap.ref.update({
      increment_id: lastIncrementId + 1,
    });
  }
}
