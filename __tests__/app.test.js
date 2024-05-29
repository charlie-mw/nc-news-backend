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

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with the requested article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: ERROR responds with an error when the article is valid but non-existent", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: ERROR responds with an error when the id is an invalid type", () => {
    return request(app)
      .get("/api/articles/nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: returns an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
test("200: SORT BY query; returns an array of article objects sorted DESC by given parameter in the query", () => {
  return request(app)
    .get("/api/articles?sort_by=article_id")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("article_id", {
        descending: true,
      });
    });
});
test("200: ORDER BY query; returns an array of article objects sorted ASC", () => {
  return request(app)
    .get("/api/articles?order=ASC")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("created_at", {
        descending: false,
      });
    });
});
test("200: ORDER BY and SORT BY query; returns an array of article objects sorted by title in ascending order", () => {
  return request(app)
    .get("/api/articles?sort_by=title&order=ASC")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("title", {
        descending: false,
      });
    });
});
test("400: SORT BY query; returns an error when passing an invalid column name", () => {
  return request(app)
    .get("/api/articles?sort_by=invalid")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid sort_by");
    });
});
test("400: ORDER BY query; returns an error when passing an invalid order", () => {
  return request(app)
    .get("/api/articles?order=invalid")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid order");
    });
});
describe("GET /api/articles/:article_id/comments", () => {
  test.only("status 200: responds with an array of comments from the requested article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
          });
        });
      });
  });
    test.only("status 404: responds with an error message when passed an article id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
});
