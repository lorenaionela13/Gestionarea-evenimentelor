import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEventGroup = () => {
  const [groupName, setGroupName] = useState("");  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const response = await axios.post("http://localhost:5000/api/eventGroup/group", {
        name: groupName,  
      });
      alert("Grupul de evenimente a fost adăugat cu succes!");
      
      
      navigate("/events");  
      
    } catch (error) {
      console.error("Eroare la adăugarea grupului de evenimente:", error.message);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Adaugă Grup de Evenimente</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nume Grup:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Adaugă Grup
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    margin: "3rem auto",
    padding: "2rem",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "black",
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
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
    color: "black",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "80%",
    maxWidth: "400px",
  },
  submitButton: {
    backgroundColor: "#E91E63",
    color: "black",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
};

export default AddEventGroup;
