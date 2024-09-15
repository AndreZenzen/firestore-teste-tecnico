import { https, firestore, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { RecordController } from "./interfaces/recordController";
import { IncrementRecordIdTrigger } from "./application/incrementIdRecordTriggers";
import { FirebaseRecordRepository } from "./Infrastructure/firebaseRecordRepository";
import { CreateRecordService } from "./application/createRecordService";

admin.initializeApp();

const repository = new FirebaseRecordRepository();
const service = new CreateRecordService(repository);
const recordController = new RecordController(service, logger);
const incrementIdTrigger = new IncrementRecordIdTrigger(repository);

// firestore trigger
const triggerIncrementRecordId = firestore
  .document("records/{recordId}")
  .onCreate((snap, context) => {
    return incrementIdTrigger.execute(snap);
  });

// http
const createRecord = https.onRequest((req, res) => {
  return recordController.createRecordHandler(req, res);
});

export { createRecord, triggerIncrementRecordId };
