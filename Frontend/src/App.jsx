import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
  if (title.trim() === "") {
    alert("Task cannot be empty");
    return;
  }

  if (editId) {
    axios
      .put(`http://localhost:5000/api/tasks/${editId}`, {
        title,
      })
      .then(() => {
        setTitle("");
        setEditId(null);
        fetchTasks();
      });
  } else {
    axios
      .post("http://localhost:5000/api/tasks", {
        title,
      })
      .then(() => {
        setTitle("");
        fetchTasks();
      });
  }
};
  const deleteTask = (id) => {
  axios
    .delete(`http://localhost:5000/api/tasks/${id}`)
    .then(() => {
      fetchTasks();
    })
    .catch((err) => console.log(err));
};
  

  return (
    <div className="container">
      <h1>Task Tracker</h1>
      <p>Total Tasks: {tasks.length}</p>
      
      <input
        type="text"
        placeholder="Enter Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="text" placeholder="Search Task..." value={search} onChange={(e) => setSearch(e.target.value)}/>
       <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Tasks</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>


      <button className="add-btn" onClick={addTask}>
         {editId ? "Update Task" : "Add Task"}
      </button>

      {tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
       }).
         map((task) => ( 
        <div className="task-card" key={task._id}>
        <div className="task-title">{task.title}</div>

        <p className="status">
           {task.completed ? "✅ Completed" : "❌ Pending"}
        </p>

      <div className="actions">
      <button className="edit-btn" onClick={() => {
          setTitle(task.title);
          setEditId(task._id);
        }}>
        Edit
      </button>

        <button className="delete-btn" onClick={() => deleteTask(task._id)}>
          Delete
        </button>
      </div>
    </div>
  ))}
    </div>
  );
}

export default App;