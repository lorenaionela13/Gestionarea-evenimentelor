const express = require('express');
const { parse } = require('json2csv');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');  
const router = express.Router();


router.get('/:eventId/export/csv', async (req, res) => {
  const { eventId } = req.params;

  try {

    const participants = await Attendance.find({ eventId });

    if (participants.length === 0) {
      return res.status(404).json({ message: 'Nu există participanți pentru acest eveniment.' });
    }

  
    const participantsData = participants.map(participant => ({
      name: participant.name,
      accessCode: participant.accessCode,
      status: participant.status,
      joinedAt: participant.joinedAt,
    }));

  
    const csv = parse(participantsData);

    
    res.header('Content-Type', 'text/csv');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Content-Disposition', 'attachment; filename=participants.csv');

   
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la exportul participanților', error: err.message });
  }
});



module.exports = router;
