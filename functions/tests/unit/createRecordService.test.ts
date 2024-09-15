import { CreateRecordService } from "../../src/application/createRecordService";
import { IRecordRepository } from "../../src/domain/IRecordRepository";
import { Record } from "../../src/domain/record";

const mockRepository: jest.Mocked<IRecordRepository> = {
  create: jest.fn(),
  getLastIncrementId: jest.fn(),
};

describe("CreateRecord", () => {
  let createRecord: CreateRecordService;

  beforeEach(() => {
    createRecord = new CreateRecordService(mockRepository);
    jest.clearAllMocks();
  });

  it("should create a new record with a valid name", async () => {
    const name = "Test Record";

    await createRecord.execute(name);

    expect(mockRepository.create).toHaveBeenCalledWith(expect.any(Record));
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if name is empty", async () => {
    const name = "";

    await expect(createRecord.execute(name)).rejects.toThrow(
      "Name is required"
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should handle repository create errors", async () => {
    const name = "Test Record";

    mockRepository.create.mockRejectedValueOnce(new Error("Repository error"));

    await expect(createRecord.execute(name)).rejects.toThrow(
      "Repository error"
    );
  });
});
