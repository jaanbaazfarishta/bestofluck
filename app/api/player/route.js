// app/api/player/route.js

import connectToDatabase from "@/lib/db";
import Player from "@/models/Player";

// POST request handler
export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { name, email, balance } = body;

    const newPlayer = new Player({ name, email, balance });
    await newPlayer.save();

    return new Response(JSON.stringify({ message: 'Player created successfully!' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Error creating Player.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT request handler for updating player balance
export async function PUT(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { email, balance } = body;

    const player = await Player.findOneAndUpdate(
      { email },
      { $set: { balance } },
      { new: true } // Return the updated document
    );

    if (!player) {
      return new Response(JSON.stringify({ error: 'Player not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Balance updated successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    return new Response(JSON.stringify({ error: 'Error updating balance.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function GET(req) {
  await connectToDatabase();

  const url = new URL(req.url, `http://${req.headers.get('host')}`);
  const email = url.searchParams.get('email'); // Get the email parameter

  try {
    let query = {};
    if (email) {
      query.email = email; // Use the email to find the player
    }

    const players = await Player.find(query);
    return new Response(JSON.stringify(players), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Players.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}