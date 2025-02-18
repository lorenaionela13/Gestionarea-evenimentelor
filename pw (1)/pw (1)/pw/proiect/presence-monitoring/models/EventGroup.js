const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const eventGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});


eventGroupSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('startDate trebuie să fie înainte de endDate'));
  }
  next();
});

const EventGroup = mongoose.model('EventGroup', eventGroupSchema);

module.exports = EventGroup;


