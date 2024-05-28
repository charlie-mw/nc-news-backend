const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200: responds with all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

test("404: ERROR responds with an error when the path is invalid", () => {
  return request(app)
    .get("/api/nonsense")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Route not found");
    });
});

describe("GET /api", () => {
  test("status 200: responds with all the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        Object.entries(body).forEach(
          ([endpointName, endpointDocumentation]) => {
            const [httpMethod, path] = endpointName.split(" ");
            expect(
              ["GET", "PUT", "POST", "PATCH", "DELETE"].includes(httpMethod)
            ).toEqual(true);
            expect(path[0]).toEqual("/");
            expect(endpointDocumentation).toMatchObject({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            });
          }
        );
      });
  });
});
