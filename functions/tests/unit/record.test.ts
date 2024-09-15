import { Record } from "../../src/domain/record";

describe("Record Class", () => {
  it("should create a Record instance with a valid name", () => {
    const record = new Record("Test Record");

    expect(record).toBeInstanceOf(Record);
    expect(record.name).toBe("Test Record");
    expect(record.incrementId).toBeUndefined();
  });

  it("should create a Record instance with a name and incrementId", () => {
    const record = new Record("Test Record", 100);

    expect(record).toBeInstanceOf(Record);
    expect(record.name).toBe("Test Record");
    expect(record.incrementId).toBe(100);
  });

  it("should throw an error if name is not provided", () => {
    expect(() => new Record("")).toThrow("Name is required");
  });

  it("should throw an error if name is undefined", () => {
    // @ts-ignore
    expect(() => new Record()).toThrow("Name is required");
  });

  it("should throw an error if name is not a string", () => {
    // @ts-ignore
    expect(() => new Record(123)).toThrow("Name must be a string");
  });
});
