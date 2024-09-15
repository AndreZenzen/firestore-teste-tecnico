const API_BASE_URL =
  process.env.API_BASE_URL ||
  "http://127.0.0.1:4000/desafiosuperfretefirebase/us-central1";

describe("# Integration - POST /createRecord", () => {
  afterEach(function () {
    jest.clearAllMocks();
  });

  it("should create a new record", async () => {
    const record = {
      name: "Test Record",
    };

    const response = await fetch(`${API_BASE_URL}/createRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    const { success } = await response.json();

    expect(response.status).toBe(201);
    expect(success).toBe(true);
  });

  it("should return 400 if name is missing", async () => {
    const record = {};

    const response = await fetch(`${API_BASE_URL}/createRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    const { error } = await response.json();

    expect(response.status).toBe(400);
    expect(error).toBe("Name is required");
  });

  it("should return 400 if name is empty", async () => {
    const record = {
      name: "",
    };
    const response = await fetch(`${API_BASE_URL}/createRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    const { error } = await response.json();

    expect(response.status).toBe(400);
    expect(error).toBe("Name is required");
  });

  it("should return 400 if name is not a string", async () => {
    const record = {
      name: 123,
    };

    const response = await fetch(`${API_BASE_URL}/createRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    const { error } = await response.json();

    expect(response.status).toBe(400);
    expect(error).toBe("Name must be a string");
  });
});
