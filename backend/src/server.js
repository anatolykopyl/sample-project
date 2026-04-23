import "dotenv/config";
import express from "express";
import cors from "cors";
import { all, run } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/tasks", async (_req, res) => {
  try {
    const rows = await all(
      "SELECT id, title, completed FROM tasks ORDER BY id DESC"
    );
    const tasks = rows.map((task) => ({
      ...task,
      completed: Boolean(task.completed)
    }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to load tasks." });
  }
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body || {};
  const normalizedTitle = typeof title === "string" ? title.trim() : "";

  if (!normalizedTitle) {
    res.status(400).json({ error: "Title is required." });
    return;
  }

  try {
    const result = await run(
      "INSERT INTO tasks (title, completed) VALUES (?, 0)",
      [normalizedTitle]
    );
    res.status(201).json({
      id: result.lastID,
      title: normalizedTitle,
      completed: false
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task." });
  }
});

app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid task id." });
    return;
  }

  try {
    const result = await run("UPDATE tasks SET completed = 1 WHERE id = ?", [id]);
    if (result.changes === 0) {
      res.status(404).json({ error: "Task not found." });
      return;
    }
    res.json({ id, completed: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
});

app.listen(port, () => {
  // Keep startup output concise for local/cloud logs.
  console.log(`MiniTasks backend running on port ${port}`);
});
