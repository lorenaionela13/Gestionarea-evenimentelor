import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import EventGroup from "./EventGroup";
import AddEvent from "./AddEvent";  
import EventList from "./EventList"; 
import EventParticipation from "./EventParticipation";
import AddEventGroup from './AddEventGroup'; 


function App() {
  return (
    <Router>
      <>
        {/* Header */}
        <header className="header">
          <div className="header-logo">Organizare Evenimente cu Stil</div>
          <nav className="header-links">
            <Link to="/">Acasă</Link>
            <Link to="/events">Evenimente</Link>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        {/* Rute pentru pagini */}
        <Routes>
          {/* Pagina principală */}
          <Route
            path="/"
            element={
              <section className="hero" id="home">
                <div>
                  <h1>Organizează Evenimente Memorabile</h1>
                  <p>Tot ce ai nevoie pentru a gestiona evenimente într-un singur loc</p>
                  <Link to="/events/add">
                    <button className="cta-button">Adaugă Grup Evenimente</button>
                  </Link>
                </div>
              </section>
            }
          />
          
          {/* Pagina Evenimente */}
          <Route
            path="/events"
            element={
              <section className="event-container" id="events">
                <h2>Grupuri Disponibile de Evenimente</h2>
                <EventGroup />
              </section>
            }
          />
          <Route
            path="/events/:groupId"
            element={
              <section className="event-container" id="events">
                <h2>Lista Evenimentelor</h2>
                <EventGroup />
              </section>
            }
          />
          <Route path="/event/:accessCode/participate" element={<EventParticipation />} />
          <Route path="/events/add" element={<AddEventGroup />} />

          {/* Ruta pentru Adăugare Eveniment */}
          <Route path="/events/:groupId/add" element={<AddEvent />} />
                <Route
        path="/events/:groupId/view"
        element={<EventList />}
      />
        </Routes>




        {/* Footer */}
        <footer className="footer" id="contact">
          <p>&copy; 2024 Organizare Evenimente cu Stil. Toate drepturile rezervate.</p>
          <p>Contact: +40 743 119 191</p>
        </footer>
      </>
    </Router>
  );
}

export default App;
