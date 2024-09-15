import { Request, Response } from "firebase-functions";
import { CreateRecordService } from "../application/createRecordService";
import { ILogger } from "../domain/ILogger";
import ValidationError from "../sharred/validationError";

export class RecordController {
  constructor(
    private createRecordService: CreateRecordService,
    private logger: ILogger
  ) {}

  async createRecordHandler(req: Request, res: Response): Promise<void> {
    try {
      if (req.method != "POST") {
        res.status(405).send("Only POST requests are allowed");
        return;
      }

      const { name } = req.body;
      this.logger.debug("Received name: " + name);

      await this.createRecordService.execute(name);

      this.logger.info("Successfully created record");
      res.status(201).send({ success: true });
      return;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        this.logger.error("Validation error on creating a record", {
          error: error.message,
        });
        res.status(error.statusCode).send({ error: error.message });
      } else {
        this.logger.error("An error occurred while creating a record", {
          message: error?.message,
          error,
        });
        res.status(500).send({ error: "An error occurred" });
      }
    }
  }
}
