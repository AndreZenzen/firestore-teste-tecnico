import { IRecordRepository } from "../domain/IRecordRepository";
import { Record } from "../domain/record";
import { firestore } from "firebase-admin";

export class FirebaseRecordRepository implements IRecordRepository {
  private collection = firestore().collection("records");

  async create(record: Record): Promise<void> {
    await this.collection.add({
      name: record.name,
      createdAt: new Date().toISOString(),
    });
  }

  async getLastIncrementId(): Promise<number | null> {
    const snapshot = await this.collection
      .orderBy("increment_id", "desc")
      .limit(1)
      .get();

    if (snapshot?.empty) {
      return null;
    }

    const lastRecord = snapshot.docs[0].data();
    return lastRecord.increment_id || null;
  }
}
