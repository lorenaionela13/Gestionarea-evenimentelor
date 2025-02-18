const express = require('express');
const router = express.Router();
const EventGroup = require('../models/EventGroup');
const Event = require('../models/Event');
const { addDays, addWeeks } = require('date-fns');


router.post('/group', async (req, res) => {
  console.log("s-a printat");
  const { name } = req.body;
  try {
    const eventGroup = new EventGroup({
      name,
      events: [],
    });

    await eventGroup.save();
    console.log("s-a apelat");
    res.status(201).json(eventGroup);
  } catch (error) {
    console.log("s-a apelat 2");
    res.status(400).json({ message: error.message });
  }
});


router.put('/event/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['OPEN', 'CLOSED'].includes(status)) {
    return res.status(400).json({ message: 'Starea este invalidă' });
  }

  try {
    const event = await Event.findByIdAndUpdate(id, { status }, { new: true });
    if (!event) return res.status(404).json({ message: 'Evenimentul nu a fost găsit' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/group/:groupId/event', async (req, res) => {
  const { groupId } = req.params;  
  const { name, startDate, endDate, location, recurring, repetitionInterval, status } = req.body; 

  try {
   
    const group = await EventGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupul de evenimente nu a fost găsit' });
    }

    
    const newEvent = new Event({
      name,
      startDate,
      endDate,
      location,
      recurring,
      repetitionInterval: recurring ? repetitionInterval : undefined,
      status: status || 'CLOSED',  
    });

    await newEvent.save();

    
    group.events.push(newEvent._id);
    await group.save();

    res.status(201).json({
      message: 'Evenimentul a fost adăugat cu succes în grupul de evenimente!',
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la crearea evenimentului', error: error.message });
  }
});


router.get('/group/:groupId/events', async (req, res) => {
  const { groupId } = req.params;

  try {
    
    const group = await EventGroup.findById(groupId).populate('events'); 
    if (!group) {
      return res.status(404).json({ message: 'Grupul de evenimente nu a fost găsit' });
    }


    res.status(200).json({
      message: 'Evenimentele grupului au fost preluate cu succes',
      events: group.events,
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea evenimentelor', error: error.message });
  }
});

module.exports = router;


