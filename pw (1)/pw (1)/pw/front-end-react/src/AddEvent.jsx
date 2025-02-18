import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddEvent = () => {
  const { groupId } = useParams(); 
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [repetitionInterval, setRepetitionInterval] = useState("daily");
  const [status, setStatus] = useState("CLOSED");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   
      const response = await axios.post(
        `http://localhost:5000/api/eventGroup/group/${groupId}/event`,
        {
          name,
          startDate,
          endDate,
          location,
          recurring,
          repetitionInterval: recurring ? repetitionInterval : undefined,
          status,
        }
      );
      alert("Evenimentul a fost adăugat cu succes!");

      
      navigate(`/events/${groupId}`); 
    } catch (error) {
      console.error("Eroare la adăugarea evenimentului:", error.message);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Adaugă Eveniment</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nume Eveniment:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Data de început:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Data de încheiere:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Locație:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Eveniment Recurs:</label>
            <input
              type="checkbox"
              checked={recurring}
              onChange={() => setRecurring(!recurring)}
              style={styles.checkbox}
            />
          </div>
          {recurring && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Interval Recurență:</label>
              <select
                value={repetitionInterval}
                onChange={(e) => setRepetitionInterval(e.target.value)}
                style={styles.select}
              >
                <option value="daily">Zilnic</option>
                <option value="weekly">Săptămânal</option>
                <option value="monthly">Lunar</option>
              </select>
            </div>
          )}
          <button type="submit" style={styles.submitButton}>
            Adaugă Eveniment
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('/pozza.jpeg')", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(8px)",
    zIndex: -1,
  },
  formContainer: {
    fontFamily: "'Poppins', sans-serif",
    margin: "3rem auto",
    padding: "2rem",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  title: {
    color: "#000",
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: "1.1rem",
    marginBottom: "5px",
    color: "#000",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "80%",
    maxWidth: "400px",
  },
  checkbox: {
    transform: "scale(1.2)",
    marginTop: "8px",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "80%",
    maxWidth: "400px",
  },
  submitButton: {
    backgroundColor: "#E91E63",
    color: "#000",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
};

export default AddEvent;

