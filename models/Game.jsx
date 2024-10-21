// models/Game.jsx

import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  email: { type: String, required: true },
  selectedNumbers: [
    {
      number: { type: Number, required: true },
      points: { type: Number, required: true },
      returningPoints: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  // Removed deleteAt field
});

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

export default Game;
