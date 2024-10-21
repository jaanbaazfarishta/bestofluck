// app/api/number/route.js

import connectToDatabase from "@/lib/db";
import Number from "@/models/Number";


// POST request handler
export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { number } = body;

    // Pehle check karein ki total kitne numbers save hain
    const count = await Number.countDocuments();

    // Agar 10 numbers ho chuke hain, sabse purana number delete kar do (FIFO logic)
    if (count >= 10) {
      await Number.findOneAndDelete({}, { sort: { createdAt: 1 } }); // Oldest number deleted
    }

    // Naya number save karein
    const newNumber = new Number({ number });
    await newNumber.save();

    return new Response(JSON.stringify({ message: 'Result created successfully!' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Error creating Result.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET request handler
export async function GET(req) {
  await connectToDatabase();

  const url = new URL(req.url, `http://${req.headers.get('host')}`);
  const group = url.searchParams.get('group');
  const id = url.searchParams.get('id');

  try {
    let query = {};
    if (group) {
      query.group = group;
    } else if (id) {
      query._id = id;
    }
    
    const number = await Number.find(query);
    return new Response(JSON.stringify(number), {
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