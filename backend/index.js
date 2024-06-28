import express from "express";

import dotenv from "dotenv";

import mongoose from "mongoose";

import { Book } from "./models/bookModel.js";

import cors from "cors"

dotenv.config();

const PORT = process.env.PORT || 3500; // If process.env.PORT is undefined, then it defaults to 3500
const app = express();

app.use(cors())



app.use(express.json());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to MERN Stack Tutorial");
});

app.post("/books", async (request, response) => {
  try {
    if (!request.body.title || !request.body.author) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishyear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
    };
    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

app.put("/books/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishyear",
      });
    }

    const { id } = request.params;
    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }
    return response.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("app connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
