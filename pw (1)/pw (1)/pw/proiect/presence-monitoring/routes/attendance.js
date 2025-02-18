const express = require('express');
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const router = express.Router();

router.post('/', async (req, res) => {
  const { accessCode, participantName } = req.body;
  console.log('Codul de acces primit:', accessCode);

  try {
    
    const accessCodeString = String(accessCode); 
    const event = await Event.findOne({ accessCode: accessCodeString });
console.log('Eveniment găsit:', event);



    if (!event) {
      console.error(`Evenimentul cu codul de acces ${accessCode} nu a fost găsit.`);
      return res.status(400).json({ error: 'Codul de acces este incorect sau evenimentul nu există.' });
    }

    
    const attendance = await Attendance.create({
      eventId: event._id,
      name: participantName,  
      accessCode, 
    });

    console.log(`Participantul ${participantName} a fost confirmat pentru evenimentul ${event.name}`);
    res.status(201).json({
      success: true,
      message: 'Prezența a fost confirmată cu succes!',
      attendance,
    });

  } catch (error) {
    console.error('Eroare la procesarea cererii:', error);
    res.status(500).json({ error: 'Eroare la confirmarea prezenței' });
  }
});

router.get("/event/:eventId/participate", (req, res) => {
  const eventId = req.params.eventId;

  res.send("Pagina de participare pentru evenimentul cu ID: " + eventId);
});


router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;


  console.log('eventId:', eventId); 
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    console.error('ID-ul evenimentului nu este valid:', eventId);
    return res.status(400).json({ error: 'ID-ul evenimentului nu este valid' });
  }

  try {

    const participants = await Attendance.find({ eventId: new mongoose.Types.ObjectId(eventId) });

    console.log('Participanți găsiți:', participants); 
    res.json(participants);
  } catch (error) {
    console.error('Eroare la obținerea participanților:', error);
    res.status(500).json({ error: 'Eroare la obținerea participanților' });
  }
});


module.exports = router;
