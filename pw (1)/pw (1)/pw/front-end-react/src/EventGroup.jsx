import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const EventGroup = () => {
  const [eventGroup, setEventGroup] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchEventGroup();
  }, []);

  const fetchEventGroup = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/eventGroup");
      setEventGroup(response.data);
    } catch (error) {
      console.error("Eroare la încărcarea grupurilor de evenimente:", error.message);
    }
  };


  const handleAddEvent = (groupId) => {
    navigate(`/events/${groupId}/add`); 
  };

  
  const handleViewEvents = (groupId) => {
    navigate(`/events/${groupId}/view`); 
  };

  return (
    <div style={styles.container}>
      {eventGroup.length > 0 ? (
        <div>
          {eventGroup.map((group) => (
            <div key={group._id} style={styles.groupCard}>
              <h3>{group.name}</h3>
              <div>
                <button
                  style={styles.button}
                  onClick={() => handleViewEvents(group._id)} 
                >
                  Afișare Evenimente
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleAddEvent(group._id)} 
                >
                  Adaugă Eveniment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nu există grupuri de evenimente disponibile.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "2rem auto",
    maxWidth: "800px",
    textAlign: "center",
    position: "relative",
    minHeight: "100vh", 
    backgroundImage: "url('/pahare.jpeg')", 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat", 
  },
  groupCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.7)", 
  },
  button: {
    padding: "0.5rem 1rem",
    margin: "0 0.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EventGroup;
