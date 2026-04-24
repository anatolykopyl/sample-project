const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:4000" : "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // Ignore non-JSON error response.
    }
    throw new Error(message);
  }

  return response.json();
}

export function getTasks() {
  return request("/tasks");
}

export function createTask(title) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title })
  });
}

export function completeTask(id) {
  return request(`/tasks/${id}`, { method: "PUT" });
}
