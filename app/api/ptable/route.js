// app/api/ptable/rote.s

import Game from '@/models/Game';
import connectToDatabase from '@/lib/db';

export async function GET(request) {
    try {
        await connectToDatabase();
        
        const url = new URL(request.url);
        const email = url.searchParams.get('email'); // Get email from query parameter

        let games;

        if (email) {
            games = await Game.find({ email }); // Fetch games for the specific email
        } else {
            games = await Game.find({}); // Fetch all games if no email is provided
        }

        const headers = new Headers({
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json'
        });

        return new Response(JSON.stringify(games), { status: 200, headers });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch game data' }), { status: 500 });
    }
}
