import { useEffect, useState } from "react";
import { completeTask, createTask, getTasks } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAddTask(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createTask(trimmed);
      setTitle("");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Could not create task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleComplete(taskId) {
    try {
      setError("");
      await completeTask(taskId);
      setTasks((previous) =>
        previous.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (err) {
      setError(err.message || "Could not update task.");
    }
  }

  return (
    <main className="app">
      <h1>MiniTasks</h1>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task..."
          disabled={submitting}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <ul className="task-list">
          {tasks.length === 0 && <li>No tasks yet.</li>}
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "done" : ""}>
              <span>{task.title}</span>
              {!task.completed && (
                <button onClick={() => handleComplete(task.id)}>Complete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
