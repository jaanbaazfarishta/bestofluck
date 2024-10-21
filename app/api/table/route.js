// app/api/table/route.js

import Game from '@/models/Game';
import connectToDatabase from '@/lib/db';

export async function GET() {
    try {
        await connectToDatabase();
        const game = await Game.find({});

        // Set Cache-Control header to prevent caching
        const headers = new Headers({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',  // If there's a proxy, this makes sure it doesn't cache.
            'Content-Type': 'application/json'
        });
        

        return new Response(JSON.stringify(game), { status: 200, headers });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch students' }), { status: 500 });
    }
}
