// app/api/game/route.js

import { NextResponse } from 'next/server';
import Game from '@/models/Game';
import Player from '@/models/Player';  // Import the player model
import connectToDatabase from "@/lib/db";

export async function POST(req) {
  try {
    const { email, selectedNumbers } = await req.json();

    await connectToDatabase();

    const newGame = new Game({
      email,
      selectedNumbers,
    });

    await newGame.save();

    return NextResponse.json({ message: 'Game data saved successfully' });
  } catch (error) {
    console.error('Error saving game data:', error);
    return NextResponse.json({ error: 'Failed to save game data' }, { status: 500 });
  }
}

// Fetch players based on selected number
export async function GET(req) {
  await connectToDatabase();
  
  const url = new URL(req.url, `http://${req.headers.get('host')}`);
  const number = parseInt(url.searchParams.get('number'));

  try {
    const games = await Game.find({
      "selectedNumbers.number": number, // Check if the number exists in selected numbers
    });

    const emails = games.map(game => game.email); // Extract emails
    const players = await Player.find({ email: { $in: emails } });

    // Add the returning points to the response
    const playersWithPoints = players.map(player => {
      const selectedGame = games.find(game => game.email === player.email);
      const returningPoints = selectedGame.selectedNumbers.find(numObj => numObj.number === number).returningPoints;
      return {
        email: player.email,
        balance: player.balance,
        returningPoints: returningPoints
      };
    });

    return new Response(JSON.stringify(playersWithPoints), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching players by number:', error);
    return new Response(JSON.stringify({ error: 'Error fetching players.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Delete all game documents after processing
export async function DELETE(req) {
  await connectToDatabase();

  try {
    await Game.deleteMany({});  // Delete all documents in the game collection

    return new Response(JSON.stringify({ message: 'Game data deleted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting game data:', error);
    return new Response(JSON.stringify({ error: 'Error deleting game data.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
