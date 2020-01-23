const request = require("supertest");
const app = require("../src/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "jitendra",
      email: "jitendra@excample.com",
      password: "Ronaldo@7"
    })
    .expect(201);
});
