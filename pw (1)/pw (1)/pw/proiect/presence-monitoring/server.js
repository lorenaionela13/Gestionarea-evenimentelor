const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const eventGroupRoutes = require('./routes/eventGroupRoutes');
const Event = require('./models/Event'); 
const Attendance = require('./models/Attendance'); 
const attendanceRoutes = require('./routes/attendance'); 
const EventGroup = require('./models/EventGroup');
const { addDays, addWeeks } = require('date-fns');  
const QRCode = require('qrcode');  
const { v4: uuidv4 } = require('uuid');
const logger = require('winston');
const exportRoutes = require('./routes/exportRoutes');
const cron = require('node-cron');
const updateEventStatus = require('./controllers/updateEventStatus');
const cors = require('cors'); 

const server = express();

cron.schedule('* * * * *', async () => {
  const now = new Date();
  console.log('Cron job executat la: ', now.toISOString());
  await updateEventStatus();  
 });




const app = express();

mongoose.connect('mongodb://localhost:27017/mydb')
  .then(() => {
    console.log('Conexiune la MongoDB reușită!');
  })
  .catch((err) => {
    console.error('Eroare la conectarea la MongoDB:', err);
  });


app.use(express.json());
app.use(bodyParser.json());
app.use('/attendance', exportRoutes)

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/eventGroup', eventGroupRoutes);
app.use(express.static("client/build"));
app.use('/api/attendance', attendanceRoutes);

app.get('/', async (req, res) => {
  try {
    const eventGroups = await EventGroup.find(); 
    let eventGroupsHTML = '<h1>Grupuri de Evenimente</h1>';
    eventGroups.forEach(group => {
      eventGroupsHTML += `
        <div>
          <h3>${group.name}</h3>
          <p>ID Grup: ${group._id}</p>
        </div>
      `;
    });
    res.send(eventGroupsHTML); 
  } catch (err) {
    res.status(500).send('Eroare la obținerea grupurilor de evenimente');
  }
});

app.get('/api/eventGroup/:id/accessCode', async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  try {
    const group = await EventGroup.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Grupul de evenimente nu a fost găsit' });
    }
    if (!group.accessCode) {
      return res.status(400).json({ message: 'Codul de acces nu este disponibil' });
    }
    console.log('Cod de acces:', group.accessCode);


    if (type === 'text') {
      res.send(`<h3>Codul de acces este: ${group.accessCode}</h3>`);
    } else if (type === 'qr') {
      const qrCode = await QRCode.toDataURL(group.accessCode);
      res.send(`<img src="${qrCode}" alt="QR Code pentru codul de acces" />`);
    } else {
      res.status(400).json({ message: 'Tip invalid. Utilizați "text" sau "qr"' });
    }

    console.log('Cod de acces:', group.accessCode);

  } catch (err) {
    res.status(500).json({ message: 'Eroare la generarea codului QR' });
  }
});



app.post('/api/attendance', async (req, res) => {
  const { accessCode, participantName } = req.body;
  
  try {
    const event = await Event.findOne({ accessCode });
    
    if (!event) {
      return res.status(404).send({ success: false, message: "Codul de acces este invalid!" });
    }


    const newAttendance = new Attendance({
      accessCode,
      participantName
    });

    await newAttendance.save();

    res.status(200).send({ success: true, message: "Prezența a fost confirmată." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "A apărut o eroare. Te rugăm să încerci din nou." });
  }
});

app.get('/api/eventGroup', async (req, res) => {
  try {
    const eventGroups = await EventGroup.find();
    res.json(eventGroups);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea grupurilor de evenimente' });
  }
});

app.get('/api/attendance/:eventId/export/csv', async (req, res) => {
  const { eventId } = req.params;
  try {
    const participants = await getParticipantsForEvent(eventId); 
    const csv = convertToCSV(participants);
    res.header('Content-Type', 'text/csv');
    res.attachment('participants.csv');
    res.send(csv);
  } catch (error) {
    console.error("Eroare la generarea CSV-ului:", error);
    res.status(500).send('Eroare la generarea fișierului CSV');
  }
});


app.listen(5000, () => {
  console.log('Serverul rulează pe portul 5000');
});
