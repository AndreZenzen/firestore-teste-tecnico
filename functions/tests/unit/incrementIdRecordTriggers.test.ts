import { IRecordRepository } from "../../src/domain/IRecordRepository";
import { IncrementRecordIdTrigger } from "../../src/application/incrementIdRecordTriggers";

const mockRepository: jest.Mocked<IRecordRepository> = {
  create: jest.fn(),
  getLastIncrementId: jest.fn(),
};

const mockFirestoreSnapshot = {
  data: jest.fn(),
  ref: {
    update: jest.fn(),
  },
};

describe("RecordController", () => {
  let trigger: IncrementRecordIdTrigger;

  beforeEach(() => {
    trigger = new IncrementRecordIdTrigger(mockRepository);
    jest.clearAllMocks();
  });

  it("should not update if increment_id is already present", async () => {
    mockFirestoreSnapshot.data.mockReturnValue({ increment_id: 10 });
    await trigger.execute(mockFirestoreSnapshot as any);

    expect(mockFirestoreSnapshot.ref.update).not.toHaveBeenCalled();
  });

  it("should increment the ID if increment_id is not present", async () => {
    mockFirestoreSnapshot.data.mockResolvedValue({ name: "record test" });

    mockRepository.getLastIncrementId.mockResolvedValue(50);

    await trigger.execute(mockFirestoreSnapshot as any);

    expect(mockFirestoreSnapshot.ref.update).toHaveBeenCalledWith({
      increment_id: 51,
    });
  });

  it("should set increment_id to 1 if no records exist", async () => {
    mockFirestoreSnapshot.data.mockResolvedValue({ name: "record test" });

    mockRepository.getLastIncrementId.mockResolvedValue(null);

    await trigger.execute(mockFirestoreSnapshot as any);

    expect(mockFirestoreSnapshot.ref.update).toHaveBeenCalledWith({
      increment_id: 1,
    });
  });
});
