import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import { expect } from "chai";
import app from "../index.js";
import Book from "../models/book-model.js"
import dummyBooks from "../dummy/books.js"

chai.use(chaiHttp);

describe("Books API", () => {
  beforeEach((done) => {
    Book.deleteMany({}).then(() => done());
  });

  after(async () => {
    // await Book.deleteMany({});
    await mongoose.disconnect();
  });

  /**
   * Test the GET route
   */
  describe("GET /api/books", () => {
    it("It should GET all the books", async () => {
      await Book.insertMany(dummyBooks);
      const res = await chai.request(app).get("/api/books");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.a.property("data");
      expect(res.body.data.length).to.equal(3);
    });

    it("It should NOT GET all the tasks", async () => {
      const res = await chai.request(app).get("/api/book");
      expect(res.status).to.equal(404);
    });
  });

  /**
   * Test the GET (by isbn13) route
   */
  describe("GET /api/books/:isbn13", () => {
    it("It should GET a book by ISBN13", async () => {
      await Book.insertMany(dummyBooks);
      const dummyIsbn13 = dummyBooks[0].isbn13;
      const res = await chai.request(app).get(`/api/books/${dummyIsbn13}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.a.property("data");
      expect(res.body.data).to.be.a("object");
      expect(res.body.data).to.have.a.property("isbn13");
      expect(res.body.data).to.have.a.property("author");
      expect(res.body.data).to.have.a.property("title");
      expect(res.body.data.isbn13).equals(dummyIsbn13);
    });

    it("It should NOT GET a task by ivalid ISBN13", async () => {
      const invalidIsbn13 = "invalid";
      const res = await chai.request(app).get(`/api/books/${invalidIsbn13}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.a.property("message");
      expect(res.body.message).equals("Book not found");
    });
  });

  /**
   * Test the POST route
   */
  describe("POST /api/books", () => {
    it("It should POST a new book", async () => {
      const book = {
        isbn13: "9780553173253",
        author: "Stephen Hawking",
        title: "A Brief History of Time",
      };

      const res = await chai.request(app).post("/api/books").send(book);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.a.property("data");
      expect(res.body.data).to.be.a("object");
      expect(res.body.data).to.have.a.property("isbn13");
      expect(res.body.data).to.have.a.property("author");
      expect(res.body.data).to.have.a.property("title");
      expect(res.body.data.isbn13).equals(book.isbn13);
      expect(res.body.data.author).equals(book.author);
      expect(res.body.data.title).equals(book.title);
    });

    it("It should NOT POST a new book without the isbn13 property", async () => {
      const book = {
        author: "Stephen Hawking",
        title: "A Brief History of Time",
      };

      const res = await chai.request(app).post("/api/books").send(book);
      expect(res.status).to.equal(400);
      expect(res.body).to.have.a.property("message");
      expect(res.body.message).equals(
        "Request body should have isbn13, author and title"
      );
    });
  });

  /**
   * Test the PUT route
   */
  describe("PUT /api/books/:isbn13", () => {
    it("It should PUT an existing book", async () => {
      await Book.create(dummyBooks[0]);
      const isbn13 = dummyBooks[0].isbn13;
      const book = {
        author: "Changed Author",
        title: "Changed Title",
      };
      const res = await chai
        .request(app)
        .put(`/api/books/${isbn13}`)
        .send(book);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.a.property("data");
      expect(res.body.data).to.be.a("object");
      expect(res.body.data).to.have.a.property("isbn13");
      expect(res.body.data).to.have.a.property("author");
      expect(res.body.data).to.have.a.property("title");
      expect(res.body.data.author).equals(book.author);
      expect(res.body.data.title).equals(book.title);
    });

    it("It should NOT PUT for book that does not exist in database", async () => {
      const isbn13 = "9780553573404";
      const book = {
        author: "A Game of Thrones",
        title: " George R. R. Martin",
      };
      const res = await chai
        .request(app)
        .put(`/api/books/${isbn13}`)
        .send(book);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.a.property("message");
      expect(res.body.message).equals("Book not found");
    });
  });

  /**
   * Test the DELETE route
   */
  describe("DELETE /api/books/:isbn13", () => {
    it("It should DELETE an existing book", async () => {
      await Book.insertMany(dummyBooks);
      const isbn13 = dummyBooks[0].isbn13;
      const res = await chai.request(app).delete(`/api/books/${isbn13}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.a.property("message");
      expect(res.body.message).equals(`Book with ISBN13:${isbn13} deleted`);
    });

    it("It should NOT DELETE a book that is not in the database", async () => {
      const isbn13 = "9780553573404";
      const res = await chai.request(app).delete(`/api/books/${isbn13}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.a.property("message");
      expect(res.body.message).equals(
        `Book with ISBN13:${isbn13} does not exist`
      );
    });
  });
});
