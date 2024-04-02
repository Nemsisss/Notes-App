import express from "express";
import cors from "cors";
import exp from "constants";
import { PrismaClient } from "@prisma/client";
import { parse } from "path";

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); //parses the body from an API request into json, so we dont have to do it manually
app.use(cors());

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("title and content fields are required");
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops something went wrong");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("title and content fields are required");
  }
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }
  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});
app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid integer");
  }
  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("oops, something went wrong");
  }
});
app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});
