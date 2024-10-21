// models/Number.jsx

import mongoose from 'mongoose';

const NumberSchema = new mongoose.Schema({
  number: { type: Number, required: true },
}, { timestamps: true }); // This will automatically add createdAt and updatedAt fields

export default mongoose.models.Number || mongoose.model('Number', NumberSchema);
