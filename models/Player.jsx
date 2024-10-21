// moedls/Player.jsx

import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  balance: { type: Number, required: true },
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);
