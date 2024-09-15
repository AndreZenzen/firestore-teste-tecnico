import { Request, Response } from "firebase-functions";
import { RecordController } from "../../src/interfaces/recordController";
import ValidationError from "../../src/sharred/validationError";

const createRecordServiceMock = {
  execute: jest.fn(),
};

const loggerMock = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

const mockRequest = (body = {}, method = "POST") => {
  return {
    body,
    method,
  } as unknown as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("RecordController", () => {
  let recordController: RecordController;

  beforeEach(() => {
    recordController = new RecordController(
      createRecordServiceMock as any,
      loggerMock as any
    );
    jest.clearAllMocks();
  });

  it("should return 405 if the request method is not POST", async () => {
    const req = mockRequest({}, "GET");
    const res = mockResponse();

    await recordController.createRecordHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith("Only POST requests are allowed");
    expect(createRecordServiceMock.execute).not.toHaveBeenCalled();
  });

  it("should call createRecordService and return 201 on successful request", async () => {
    const req = mockRequest({ name: "Test Record" });
    const res = mockResponse();

    await recordController.createRecordHandler(req, res);

    expect(createRecordServiceMock.execute).toHaveBeenCalledWith("Test Record");
    expect(loggerMock.info).toHaveBeenCalledWith("Successfully created record");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ success: true });
  });

  it("should log error and return 500 if createRecordService throws", async () => {
    const req = mockRequest({ name: "Test Record" });
    const res = mockResponse();
    const error = new Error("Something went wrong");

    createRecordServiceMock.execute.mockRejectedValueOnce(error);

    await recordController.createRecordHandler(req, res);

    expect(loggerMock.error).toHaveBeenCalledWith(
      "An error occurred while creating a record",
      { message: error?.message, error }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: "An error occurred" });
  });

  it("should log error and return 400 if createRecordService throws of validationError", async () => {
    const req = mockRequest({ name: "" });
    const res = mockResponse();
    const error = new ValidationError("Name is required");

    createRecordServiceMock.execute.mockRejectedValueOnce(error);

    await recordController.createRecordHandler(req, res);

    expect(loggerMock.error).toHaveBeenCalledWith(
      "Validation error on creating a record",
      { error: error.message }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "Name is required" });
  });
});
