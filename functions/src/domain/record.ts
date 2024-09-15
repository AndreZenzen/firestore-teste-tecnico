import ValidationError from "../shared/validationError";

export class Record {
  constructor(public name: string, public incrementId?: number) {
    if (!this.name) {
      throw new ValidationError("Name is required");
    }

    if (typeof this.name !== "string") {
      throw new ValidationError("Name must be a string");
    }
  }
}
