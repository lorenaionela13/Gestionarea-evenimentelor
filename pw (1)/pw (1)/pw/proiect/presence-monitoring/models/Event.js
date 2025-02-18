const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: [true, 'Start date is required'] },
  endDate: { type: Date, required: [true, 'End date is required'] },
  recurring: { type: Boolean, required: [true, 'Recurring status is required'] },
  location: { type: String, required: [true, 'Location is required'] },
  repetitionInterval: { 
    type: String, 
    enum: ['daily', 'weekly'], 
    required: function() {
      return this.recurring;
    }
  },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'CLOSED' },
  accessCode: { type: String, default: () => uuidv4() },
});


eventSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('startDate trebuie să fie înainte de endDate'));
  }
  next();
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
