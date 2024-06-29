import express from "express";

import dotenv from "dotenv";

import mongoose from "mongoose";

import { Book } from "./models/bookModel.js";

import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3500; // If process.env.PORT is undefined, then it defaults to 3500
const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to MERN Stack Tutorial");
});

app.post("/books", async (request, response) => {
  try {
    console.log("Received book data:", request.body); // Add this line
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };
    console.log("Creating new book:", newBook); // Add this line
    const book = await Book.create(newBook);
    console.log("Created book:", book); // Add this line

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
  console.log("edit book data");
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishyear",
      });
    }

    const { id } = request.params;
    console.log(request.body);
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

app.delete("/books/:id", async (request, response) => {
  console.log("delete book")
  try {
    const { id } = request.params;
    console.log("Attempting to delete book with id:", id); // Add this line for debugging

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      console.log("Book not found for deletion"); // Add this line for debugging
      return response.status(404).json({ message: "Book not found" });
    }

    console.log("Book deleted successfully"); // Add this line for debugging
    return response.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error in delete route:", error.message);
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
