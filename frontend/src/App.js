import React, { useEffect, useState } from "react";
import { api } from "./api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    position: "",
    salary: "",
  });

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      position: form.position,
      salary: Number(form.salary),
    };

    if (form.id) {
      await api.put(`/employees/${form.id}`, payload);
    } else {
      await api.post("/employees", payload);
    }
    setForm({ id: null, name: "", email: "", position: "", salary: "" });
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      position: emp.position || "",
      salary: emp.salary || "",
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Employee Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <label>Name: </label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Position: </label>
          <input name="position" value={form.position} onChange={handleChange} />
        </div>
        <div>
          <label>Salary: </label>
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{form.id ? "Update" : "Create"}</button>
        {form.id && (
          <button
            type="button"
            onClick={() =>
              setForm({ id: null, name: "", email: "", position: "", salary: "" })
            }
          >
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th>
            <th>Position</th><th>Salary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

