import { FirebaseRecordRepository } from "../../src/Infrastructure/firebaseRecordRepository";
import { Record } from "../../src/domain/record";

const mockAdd = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockGet = jest.fn();

jest.mock("firebase-admin", () => ({
  initializeApp: () => jest.fn(),
  firestore: () => ({
    collection: () => ({
      add: mockAdd,
      orderBy: mockOrderBy.mockReturnValue({
        limit: mockLimit.mockReturnValue({
          get: mockGet,
        }),
      }),
    }),
  }),
}));

describe("FirebaseRepository", () => {
  let repository: FirebaseRecordRepository;

  beforeEach(() => {
    repository = new FirebaseRecordRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should add a record to the collection", async () => {
      const mockRecord: Record = { name: "Test Record" };

      await repository.create(mockRecord);

      expect(mockAdd).toHaveBeenCalledWith({
        name: "Test Record",
        createdAt: expect.any(String),
      });
    });
  });

  describe("getLastIncrementId", () => {
    it("should return null if no records exist", async () => {
      mockGet.mockResolvedValueOnce({
        empty: true,
        docs: [],
      });

      const result = await repository.getLastIncrementId();
      expect(result).toBeNull();
    });

    it("should return the last increment_id if a record exists", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            data: () => ({ increment_id: 100 }),
          },
        ],
      });

      const result = await repository.getLastIncrementId();
      expect(result).toBe(100);
    });

    it("should return null if increment_id does not exist in the last record", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            data: () => ({}),
          },
        ],
      });

      const result = await repository.getLastIncrementId();
      expect(result).toBeNull();
    });
  });
});
