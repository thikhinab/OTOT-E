import express from "express";
import {
    getAll,
    getAllCached,
    getByIsbn13,
    createBook,
    updateByIsbn13,
    deleteByIsbn13,
} from "../controllers/book-controller.js";

const bookRouter = express.Router();

bookRouter.route("/").get(getAll).post(createBook);
bookRouter.route("/cache").get(getAllCached);

bookRouter
    .route("/:isbn13")
    .get(getByIsbn13)
    .put(updateByIsbn13)
    .delete(deleteByIsbn13);

bookRouter.all("*", async (req, res) => {
    return res.status(404).json({
        status: "error",
        message: `Invalid URL`,
    });
});

export default bookRouter;
