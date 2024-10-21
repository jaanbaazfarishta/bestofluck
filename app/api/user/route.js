// app/api/user/route.js

import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// POST request handler
export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { name, email} = body;

    const newUser = new User({ name, email });
    await newUser.save();

    return new Response(JSON.stringify({ message: 'Registered successfully!' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error Registering:', error);
    return new Response(JSON.stringify({ error: 'Error Registering.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  try {
      await connectToDatabase();
      const user = await User.find({});

      // Set Cache-Control header to prevent caching
      const headers = new Headers({
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json' // Optional, for better clarity
      });

      return new Response(JSON.stringify(user), { status: 200, headers });
  } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch Users' }), { status: 500 });
  }
}


// DELETE request handler
export async function DELETE(req) {
  await connectToDatabase();

  try {
    const { id } = await req.json(); // Expecting id to delete
    await User.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: 'User deleted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting User:', error);
    return new Response(JSON.stringify({ error: 'Error deleting User.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}