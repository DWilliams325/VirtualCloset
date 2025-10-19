import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/BookAppointment.css";

export default function BookAppointment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [itemText, setItemText] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  function addItem() {
    const text = itemText.trim();
    if (text === "") return;
    setItems([...items, text]);
    setItemText("");
    setError("");
  }

  function removeItem(index) {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return;
    }
  
    if (items.length === 0) {
      setError("Please add at least one requested item.");
      setSuccess("");
      return;
    }

    setSuccess( `Appointment booked for ${name} on ${mm}/${dd}/${yyyy} !`);
    setError("");

    // form reset
    setName("");
    setEmail("");
    setDate("");
    setItemText("");
    setItems([]);
  }

  return (
    <section className="app-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1> Book Appointment</h1>

        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Doe"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="jane@example.com"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Appointment Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={todayStr}
          />
        </div>
  {/* NOTE:  Requested Items Section should be revised once the BrowseClothing page is done */}
        <div style={{ marginBottom: 12 }}>
          <label>Requested Items</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={itemText}
              onChange={(e) => setItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
              }}
              placeholder="Enter item and press Add"
            />
            <button type="button" onClick={addItem} className="btn-add">
              <FaPlus /> Add
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="items-list">
            {items.map((it, i) => (
              <div key={i} className="item">
                <span>{it}</span>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeItem(i)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Book Appointment
        </button>

        {success && <p className="success">{success}</p>}
      </form>
    </section>
  );
}
