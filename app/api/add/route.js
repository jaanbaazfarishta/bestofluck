// app/api/add/route.js


import connectToDatabase from "@/lib/db";
import Add from "@/models/Add";

// POST request handler
export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { playerupi, upi, utr, email, balance } = body;

    const newAdd = new Add({ playerupi, upi, utr, email, balance });
    await newAdd.save();

    return new Response(JSON.stringify({ message: 'Request created successfully!' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return new Response(JSON.stringify({ error: 'Error creating request.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function GET() {
  try {
      await connectToDatabase();
      const add = await Add.find({});

      // Set Cache-Control header to prevent caching
      const headers = new Headers({
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json' // Optional, for better clarity
      });

      return new Response(JSON.stringify(add), { status: 200, headers });
  } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch Add' }), { status: 500 });
  }
}


// DELETE request handler
export async function DELETE(req) {
  await connectToDatabase();

  try {
    const { id } = await req.json(); // Expecting id to delete
    await Add.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: 'Request deleted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    return new Response(JSON.stringify({ error: 'Error deleting request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}