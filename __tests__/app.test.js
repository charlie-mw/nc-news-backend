const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

test("404: ERROR responds with an error when the path is invalid", () => {
  return request(app)
    .get("/api/nonsense")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Route not found");
    });
});

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
            if (endpointDocumentation.exampleBody) {
              expect(typeof endpointDocumentation.exampleBody).toEqual(
                "object"
              );
            }
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
        expect(res.body.article).toMatchObject({
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
    test("status 200: responds with the requested article id with a comment_count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            comment_count: "11",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  test("status 200: responds with comment_count 0 for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 2,
          comment_count: "0",
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
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
        expect(body.msg).toBe("article_id must be a number");
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
  test("200: topic query; returns an array of article objects that have the requested topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
      });
  });
  test("200: topic query and SORT BY query; returns an array of article objects that have the requested topic sorted by title", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("200: topic query; returns an empty array when the topic has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
      });
  });
  test("400: topic query; returns an error when passed a topic that is an empty string", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("topic cannot be an empty string");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: responds with an array of comments from the requested article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
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
  test("status 200: responds with an empty array when the article doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("status 404: responds with an error message when passed an article id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status 400: responds with an error message when passed an an invalid article id", () => {
    return request(app)
      .get("/api/articles/article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id must be a number");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 200: responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "Butter",
        username: "butter_bridge",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Butter",
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: 1,
        });
      });
  });
  test("status 404: responds with an error message when passed an article id that doesn't exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        body: "I love this article",
        username: "ArticleLover21",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status 400: responds with an error message when username is not passed", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "I love this article",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("username is required");
      });
  });
  test("status 400: responds with an error message when body is not passed", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "ArticleLover21",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("body is required");
      });
  });
  test("status 400: ERROR responds with an error when the id is an invalid type", () => {
    return request(app)
      .post("/api/articles/nonsense/comments")
      .send({
        body: "Butter",
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id must be a number");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: adds votes to article and returns updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status 200: subtracts votes from article and returns updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status 404: should return an error if the article doesn't exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({
        inc_votes: 10,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("status 400: should return an error if inc_votes is not set", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("inc_votes is required");
      });
  });
  test("status 400: should return an error if the new votes is less than zero", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -1000,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "An article can not have less than zero votes"
        );
      });
  });
  test("status 400: should return an error if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "votes",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("inc_votes must be a number");
      });
  });
  test("status 400: ERROR responds with an error when the id is an invalid type", () => {
    return request(app)
      .patch("/api/articles/blah")
      .send({
        inc_votes: -10,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id must be a number");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content if successfully deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: Responds with an error message if the comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("400: Responds with an error message if the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("comment_id must be a number");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
