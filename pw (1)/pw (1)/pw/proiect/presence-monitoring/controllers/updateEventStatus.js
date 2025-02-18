const EventGroup = require('../models/EventGroup');
const Event = require('../models/Event');
const moment = require('moment'); 


const updateEventStatus = async () => {
  try {
   
    const events = await Event.find();

    const now = new Date(); 

    events.forEach(async (event) => {
      
      if (now >= event.startDate && now < event.endDate) {
        if (event.status !== 'OPEN') {
          event.status = 'OPEN';
          await event.save();
          console.log(`Evenimentul "${event.name}" este acum OPEN.`);
        }
      } else if (now >= event.endDate) {
       
        if (event.status !== 'CLOSED') {
          event.status = 'CLOSED';
          await event.save();
          console.log(`Evenimentul "${event.name}" este acum CLOSED.`);
        }
      }
    });
  } catch (error) {
    console.error('Eroare la actualizarea stării evenimentului:', error);
  }
};

module.exports = updateEventStatus;

