// moedls/Player.jsx

import mongoose from 'mongoose';

const AddSchema = new mongoose.Schema({
  playerupi: { type: String, required: true },
  upi: { type: String, required: true },
  utr: { type: String, required: true },
  email: { type: String, required: true },
  balance: { type: Number, required: true },
});

export default mongoose.models.Add || mongoose.model('Add', AddSchema);
