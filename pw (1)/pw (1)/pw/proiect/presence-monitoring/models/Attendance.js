const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },              
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
   
  accessCode: { type: String, required: true },        
  status: { type: String, default: 'PRESENT' },        
  joinedAt: { type: Date, default: Date.now }           
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

