const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { addDays, addWeeks } = require('date-fns');


router.post('/generate-recurrent-events', async (req, res) => {
    const { groupId } = req.body; 
    const group = await EventGroup.findById(groupId); 
  
    if (!group) {
      return res.status(404).json({ message: 'Grupul de evenimente nu a fost găsit' });
    }
  
    const { startDate, endDate, repetitionInterval } = group;
  
    let currentDate = new Date(startDate);
    let eventsCreated = [];
  

    while (currentDate <= endDate) {
      const newEvent = new Event({
        name: `Eveniment recurent la ${currentDate}`,
        date: currentDate,
        location:location,
        eventGroupId: groupId,
        status: 'CLOSED'
      });
  
      await newEvent.save();
      eventsCreated.push(newEvent);

      if (repetitionInterval === 'daily') {
        currentDate = addDays(currentDate, 1);
      } else if (repetitionInterval === 'weekly') {
        currentDate = addWeeks(currentDate, 1);
      }
    }
  
    group.events.push(...eventsCreated.map(event => event._id));
    await group.save();
  
    res.status(201).json({ message: 'Evenimente recurente create cu succes', eventsCreated });
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
    const { name, date, location, status } = req.body; 
  
    try {
   
      const group = await EventGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Grupul de evenimente nu a fost găsit' });
      }
  
    
      const newEvent = new Event({
        name,
        date,
        location,
        status: status || 'CLOSED',  
        eventGroupId: groupId 
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

  module.exports = router;