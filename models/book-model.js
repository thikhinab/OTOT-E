import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dir } from "console";

const BookSchema = new mongoose.Schema({
    isbn13: {
        type: String,
        // unique: true, To have mock data
        trim: true,
        required: true,
        validate: {
            validator: function (val) {
                return val.length === 13 && /^\d+$/.test(val);
            },
            message: "ISBN13 should have only 13 numeric characters.",
        },
    },
    author: {
        type: String,
        requried: true,
    },
    title: {
        type: String,
        required: true,
    },
});

const Book = mongoose.model("Book", BookSchema);
Book.deleteMany({}).then(() => console.log("DB: Delete Book collection"));
const dirname = fileURLToPath(new URL(".", import.meta.url));
const data = fs.readFileSync(
    path.join(dirname, "..", "data", "mock-data.json")
);
const books = JSON.parse(data);
Book.insertMany(books).then(() => console.log("DB: Mock Book data loaded"));
export default Book;
