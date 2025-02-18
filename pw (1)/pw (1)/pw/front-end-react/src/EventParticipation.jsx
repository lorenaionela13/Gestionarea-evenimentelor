import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EventParticipation = () => {
  const { accessCode } = useParams(); 
  const [participantName, setParticipantName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!participantName.trim()) {
      setError("Numele este obligatoriu!");
      return;
    }

    try {
      
      const response = await axios.post("http://localhost:5000/api/attendance", {
        accessCode,
        participantName,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/events"); 
      } else {
        setError("Nu s-a reușit confirmarea prezenței. Încearcă din nou.");
      }
    } catch (error) {
      setError("Eroare la confirmarea prezenței. Încearcă din nou.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Confirmă-ți prezența</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Introdu numele tău"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          required
        />
        <button type="submit">Confirmă prezența</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    margin: "2rem auto",
    padding: "1rem",
    maxWidth: "400px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
};

export default EventParticipation;
