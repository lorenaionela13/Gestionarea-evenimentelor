import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from 'react-qr-code';

const EventList = () => {
  const { groupId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantName, setParticipantName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false); 
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/eventGroup/group/${groupId}/events`);
        setEvents(response.data.events);
        setLoading(false);
      } catch (error) {
        console.error("Eroare la preluarea evenimentelor:", error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [groupId]);

  
  const fetchParticipants = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attendance/${eventId}`);
      setParticipants(response.data); 
    } catch (error) {
      console.error("Eroare la preluarea participanților:", error.message);
    }
  };

  const handleConfirmAttendance = async () => {
    if (!participantName || !selectedEvent) {
      alert("Te rugăm să completezi câmpul cu numele și să selectezi un eveniment.");
      return;
    }

    const payload = {
      accessCode: selectedEvent.accessCode,
      participantName: participantName
    };

    try {
      const response = await axios.post('http://localhost:5000/api/attendance', payload);

      if (response.data.success) {
        alert("Prezența ta a fost confirmată!");
        fetchParticipants(selectedEvent._id); 
        setShowModal(false);
      }
    } catch (error) {
      console.error("Eroare la confirmarea prezenței:", error.response ? error.response.data : error.message);
      alert("Eroare la confirmarea prezenței.");
    }
  };

  const handleViewParticipants = (eventId) => {
    fetchParticipants(eventId);
    setSelectedEvent(events.find(event => event._id === eventId)); 
    setShowParticipants(true); 
  };

  const handleDownloadCSV = async (eventId) => {
    try {
      
      alert("Se pregătește descărcarea CSV...");
      
      const response = await axios.get(`http://localhost:5000/attendance/${eventId}/export/csv`, {
        responseType: 'blob', 
        withCredentials: false,
      });
  
    
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'participants.csv'); 
      document.body.appendChild(link);
      link.click(); 
  
      
      alert("Fișierul CSV a fost descărcat!");
    } catch (error) {
      console.error("Eroare la descărcarea fișierului CSV:", error.message);
      alert("Eroare la descărcarea fișierului CSV. Te rugăm să încerci din nou.");
    }
  };
  

  const handleCloseParticipants = () => {
    setShowParticipants(false); 
  };

  if (loading) {
    return <div>Se încarcă evenimentele...</div>;
  }

  return (
    <div style={styles.container}>
  <h2 style={styles.title}>Lista Evenimentelor</h2>
  {events.length === 0 ? (
    <p>Nu există evenimente în acest grup.</p>
  ) : (
    <ul style={styles.eventsList}>
      {events.map((event) => (
        <li key={event._id} style={styles.eventCard}>
          <div style={styles.eventContent}>
            <div style={styles.eventDetails}>
              <h3>{event.name}</h3>
              <p><strong>Data de început:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
              <p><strong>Data de încheiere:</strong> {new Date(event.endDate).toLocaleDateString()}</p>
              <p><strong>Locație:</strong> {event.location}</p>
              <p><strong>Recurent:</strong> {event.recurring ? "Da" : "Nu"}</p>
              {event.recurring && (
                <p><strong>Interval Recurență:</strong> {event.repetitionInterval}</p>
              )}
              <p><strong>Status:</strong> {event.status}</p>
            </div>
            <div style={styles.qrCodeContainer}>
              <QRCode value={`http://localhost:5000/event/${event._id}/participate`} />
              <p>{`Codul QR pentru evenimentul ${event.name}: ${event.accessCode}`}</p>
            </div>
                <button onClick={() => { setSelectedEvent(event); setShowModal(true); }} style={styles.selectButton}>
                  Confirmă Prezența
                </button>
                <button onClick={() => handleViewParticipants(event._id)} style={styles.selectButton}>
                  Participanți Prezenți
                </button>
                <button onClick={() => handleDownloadCSV(event._id)} style={styles.viewButton}>
                  Descarcă CSV
                </button>
              </div>

              {selectedEvent && selectedEvent._id === event._id && showParticipants && (
                <div style={styles.participantsSidebar}>
                  <h3>Participanți prezenți la {event.name}:</h3>
                  <ul style={styles.participantsList}>
                    {participants.length > 0 ? (
                      participants.map((participant, index) => {
                        const joinDate = new Date(participant.joinedAt);
                        const formattedJoinDate = joinDate instanceof Date && !isNaN(joinDate)
                          ? joinDate.toLocaleDateString() + ' ' + joinDate.toLocaleTimeString()
                          : 'Data invalidă';

                        return (
                          <li key={index}>
                            {participant.name} - <strong>Alăturat pe:</strong> {formattedJoinDate}
                          </li>
                        );
                      })
                    ) : (
                      <p>Nu există participanți pentru acest eveniment.</p>
                    )}
                  </ul>
                  <button onClick={handleCloseParticipants} style={styles.closeButton}>
                    Închide lista
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showModal && selectedEvent && (
        <div style={styles.modal}>
          <h3>Confirmă prezența la {selectedEvent.name}</h3>
          <input
            type="text"
            placeholder="Introdu numele tău"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleConfirmAttendance} style={styles.confirmButton}>
            Confirmă
          </button>
          <button onClick={() => setShowModal(false)} style={styles.cancelButton}>
            Anulează
          </button>
        </div>
      )}

      <button onClick={() => navigate("/events")} style={styles.backButton}>
        Înapoi la Grupuri
      </button>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
  },
  title: {
    textAlign: 'center',
  },
  eventsList: {
    listStyle: 'none',
    padding: 0,
  },
  eventCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '10px 0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  eventContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDetails: {
    flex: 1,
    marginRight: '20px',
  },
  qrCodeContainer: {
    textAlign: 'center',
    flexShrink: 0,
  },
  eventDetails: {
    width: "100%",
    textAlign: "left",
    color: "#34495E",
    lineHeight: "1.5",
  },
  selectButton: {
    backgroundColor: "#27AE60",
    color: "#FFFFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  selectButtonHover: {
    backgroundColor: "#2ECC71",
  },
  viewButton: {
    backgroundColor: "#F39C12",
    color: "#FFFFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  viewButtonHover: {
    backgroundColor: "#E67E22",
  },
  participantsSidebar: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ECF0F1",
    padding: "1.5rem",
    borderRadius: "12px",
    margin: "2rem auto",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
  },
  participantsList: {
    listStyleType: "none",
    padding: 0,
    margin: "0",
  },
  closeButton: {
    backgroundColor: "#E74C3C",
    color: "#FFFFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  closeButtonHover: {
    backgroundColor: "#C0392B",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "1rem 0",
    border: "1px solid #BDC3C7",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  confirmButton: {
    backgroundColor: "#3498DB",
    color: "#FFFFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    marginRight: "1rem",
    transition: "background-color 0.3s",
  },
  confirmButtonHover: {
    backgroundColor: "#2980B9",
  },
  cancelButton: {
    backgroundColor: "#E74C3C",
    color: "#FFFFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  cancelButtonHover: {
    backgroundColor: "#C0392B",
  },
  backButton: {
    marginTop: "2rem",
    backgroundColor: "#95A5A6",
    color: "#FFFFFF",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  backButtonHover: {
    backgroundColor: "#7F8C8D",
  },
};


export default EventList;
