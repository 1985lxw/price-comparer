// tests/test.js
// Run `NODE_ENV=test npm start` in one terminal, and `npm test` in another.

const request = require("supertest");
const baseUrl = "http://localhost:3000";

jest.setTimeout(15000);

describe("Price Comparer backend API", () => {
  // 1. SEARCH ENDPOINT
  describe("GET /api/search", () => {
    test("returns an array of products with required fields", async () => {
      const res = await request(baseUrl)
        .get("/api/search")
        .query({ query: "eggs", zipcode: "01002" })
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        const item = res.body[0];
        expect(item).toHaveProperty("store");
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("price");
        expect(item).toHaveProperty("lastUpdated");
      }
    });

    test("returns 400 when query is missing", async () => {
      const res = await request(baseUrl)
        .get("/api/search")
        .query({ zipcode: "01002" }) // missing "query"
        .expect(400);

      const body = typeof res.body === "object" ? res.body : {};
      const errorText = body.error || res.text || "";
      expect(errorText.toLowerCase()).toContain("query");
    });

    test("works even when zipcode format is invalid", async () => {
      const res = await request(baseUrl)
        .get("/api/search")
        .query({ query: "milk", zipcode: "abc123" }) // invalid format
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    test("returns sensible structure for multiple results", async () => {
      const res = await request(baseUrl)
        .get("/api/search")
        .query({ query: "bread", zipcode: "01002" })
        .expect(200);

      if (res.body.length >= 2) {
        const stores = res.body.map(i => i.store);
        const titles = res.body.map(i => i.title);
        // not a strong assertion, but checks variety and non empty strings
        expect(stores.every(s => typeof s === "string" && s.length > 0)).toBe(true);
        expect(titles.every(t => typeof t === "string" && t.length > 0)).toBe(true);
      }
    });
  });

  // 2. SHOPPING LIST SAVE ENDPOINT
  describe("POST /api/shopping/save", () => {
    test("saves a valid shopping list and returns success", async () => {
      const payload = {
        items: [
          {
            id: "test-1",
            title: "Large Eggs Grade A 12ct",
            store: "walmart.com",
            price: 7.19,
            qty: 2
          }
        ]
      };

      const res = await request(baseUrl)
        .post("/api/shopping/save")
        .send(payload)
        .expect(200);

      const body = typeof res.body === "object" ? res.body : {};
      expect(body.message || "").toMatch(/saved/i);
    });

    test("saves multiple items without error", async () => {
      const payload = {
        items: [
          {
            id: "test-1",
            title: "Large Eggs Grade A 12ct",
            store: "walmart.com",
            price: 7.19,
            qty: 2
          },
          {
            id: "test-2",
            title: "Whole Milk 1 gal",
            store: "target.com",
            price: 4.5,
            qty: 1
          }
        ]
      };

      const res = await request(baseUrl)
        .post("/api/shopping/save")
        .send(payload)
        .expect(200);

      const body = typeof res.body === "object" ? res.body : {};
      expect(body.message || "").toMatch(/saved/i);
    });

    test("handles an empty items array gracefully", async () => {
      const payload = { items: [] };

      const res = await request(baseUrl)
        .post("/api/shopping/save")
        .send(payload)
        .expect(200);

      const body = typeof res.body === "object" ? res.body : {};
      expect(body.message || "").toMatch(/saved/i);
    });

    test("returns 400 when items is missing", async () => {
      const res = await request(baseUrl)
        .post("/api/shopping/save")
        .send({})
        .expect(400);

      const body = typeof res.body === "object" ? res.body : {};
      const errorText = body.error || res.text || "";
      expect(errorText.toLowerCase()).toContain("items");
    });

    test("returns 400 when items is not an array", async () => {
      const res = await request(baseUrl)
        .post("/api/shopping/save")
        .send({ items: "not-an-array" })
        .expect(400);

      const body = typeof res.body === "object" ? res.body : {};
      const errorText = body.error || res.text || "";
      expect(errorText.toLowerCase()).toContain("items");
    });
  });

  // 3. EXPORT PDF ENDPOINT
  describe("POST /api/export/pdf", () => {
    test("returns a PDF for a valid items list", async () => {
      const payload = {
        items: [
          {
            title: "Large Eggs Grade A 12ct",
            store: "walmart.com",
            qty: 2,
            price: 7.19
          },
          {
            title: "Whole Milk 1 gal",
            store: "target.com",
            qty: 1,
            price: 4.5
          }
        ]
      };

      const res = await request(baseUrl)
        .post("/api/export/pdf")
        .send(payload)
        .expect(200);

      expect(res.headers["content-type"]).toMatch(/application\/pdf/);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("still returns a PDF when items list is empty", async () => {
      const payload = {
        items: []
      };

      const res = await request(baseUrl)
        .post("/api/export/pdf")
        .send(payload)
        .expect(200);

      expect(res.headers["content-type"]).toMatch(/application\/pdf/);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("returns a PDF when items is missing (server defaults to empty)", async () => {
      const res = await request(baseUrl)
        .post("/api/export/pdf")
        .send({})
        .expect(200);

      expect(res.headers["content-type"]).toMatch(/application\/pdf/);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // Auth tests: /api/auth/sign-up and /api/auth/sign-in

describe("Auth API", () => {
  // Helper to make a unique email each time
  function makeEmail(prefix = "user") {
    const ts = Date.now();
    return `${prefix}+${ts}@example.com`;
  }

  const password = "TestPassword123!";

  test("sign-up requires both email and password", async () => {
    // Missing both
    let res = await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({})
      .expect(400);

    let body = typeof res.body === "object" ? res.body : {};
    expect((body.error || "").toLowerCase()).toContain("email and password");

    // Missing password
    res = await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({ email: makeEmail("missingpass") })
      .expect(400);

    body = typeof res.body === "object" ? res.body : {};
    expect((body.error || "").toLowerCase()).toContain("email and password");
  });

  test("sign-up succeeds for a new user", async () => {
    const email = makeEmail("signup");

    const res = await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({ email, password })
      .expect(200);

    const body = typeof res.body === "object" ? res.body : {};
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.id).toBeDefined();
  });

  test("sign-up prevents duplicate users with same email", async () => {
    const email = makeEmail("duplicate");

    // First time should succeed
    await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({ email, password })
      .expect(200);

    // Second time should fail with 400
    const res = await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({ email, password })
      .expect(400);

    const body = typeof res.body === "object" ? res.body : {};
    expect((body.error || "").toLowerCase()).toContain("already exists");
  });

  test("sign-in fails with missing email or password", async () => {
    // Missing email
    let res = await request(baseUrl)
      .post("/api/auth/sign-in")
      .send({ password })
      .expect(400);

    let body = typeof res.body === "object" ? res.body : {};
    expect((body.error || "").toLowerCase()).toContain("email and password");

    // Missing password
    res = await request(baseUrl)
      .post("/api/auth/sign-in")
      .send({ email: makeEmail("signinmissing") })
      .expect(400);

    body = typeof res.body === "object" ? res.body : {};
    expect((body.error || "").toLowerCase()).toContain("email and password");
  });

  test("sign-in fails with wrong credentials", async () => {
    const email = makeEmail("wrongpass");

    // Create a user first
    await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({ email, password })
      .expect(200);

    // Try to sign in with wrong password
    const res = await request(baseUrl)
      .post("/api/auth/sign-in")
      .send({ email, password: "NotTheRightPassword" })
      .expect(400);

    const body = typeof res.body === "object" ? res.body : {};
    expect((body.error || "").toLowerCase()).toContain("invalid credentials");
  });

  test("sign-in succeeds with correct email and password", async () => {
    const email = makeEmail("signinok");

    // Ensure user exists
    await request(baseUrl)
      .post("/api/auth/sign-up")
      .send({ email, password })
      .expect(200);

    // Now sign in
    const res = await request(baseUrl)
      .post("/api/auth/sign-in")
      .send({ email, password })
      .expect(200);

    const body = typeof res.body === "object" ? res.body : {};
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.id).toBeDefined();
  });
});


  // 4. EMAIL ENDPOINT
  describe("POST /api/email", () => {
    test("returns success when email and items are valid", async () => {
      const payload = {
        email: "test@example.com",
        items: [
          {
            title: "Large Eggs Grade A 12ct",
            store: "walmart.com",
            qty: 2,
            price: 7.19
          }
        ]
      };

      const res = await request(baseUrl)
        .post("/api/email")
        .send(payload)
        .expect(200);

      const body = typeof res.body === "object" ? res.body : {};
      const msg = body.message || res.text || "";
      expect(msg.toLowerCase()).toContain("email");
    });

    test("returns 400 when email is missing", async () => {
      const payload = {
        items: [
          {
            title: "Large Eggs Grade A 12ct",
            store: "walmart.com",
            qty: 2,
            price: 7.19
          }
        ]
      };

      const res = await request(baseUrl)
        .post("/api/email")
        .send(payload)
        .expect(400);

      const body = typeof res.body === "object" ? res.body : {};
      const errorText = body.message || body.error || res.text || "";
      expect(errorText.toLowerCase()).toContain("email");
    });

    test("returns 400 when items list is empty", async () => {
      const payload = {
        email: "test@example.com",
        items: []
      };

      const res = await request(baseUrl)
        .post("/api/email")
        .send(payload)
        .expect(400);

      const body = typeof res.body === "object" ? res.body : {};
      const errorText = body.message || body.error || res.text || "";
      expect(errorText.toLowerCase()).toContain("shopping list");
    });

    test("returns 400 when items is not an array", async () => {
      const payload = {
        email: "test@example.com",
        items: "not-an-array"
      };

      const res = await request(baseUrl)
        .post("/api/email")
        .send(payload)
        .expect(400);

      const body = typeof res.body === "object" ? res.body : {};
      const errorText = body.message || body.error || res.text || "";
      expect(errorText.toLowerCase()).toContain("shopping list");
    });
  });
});
