import React from 'react';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function Admin() {
    const session = await auth();

    // Agar session nahi hai ya email address "sksmarthubbly@gmail.com" nahi hai, tab redirect karein
    if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
        return (
            <div>
                <h1 className='text-xl text-rose-700'>Access Denied</h1>
                <p>You do not have permission to access this page.</p>
            </div>
        );
    }

    return (
        <div className='sm:hidden p-4'>
            <h1 className='text-center'>Admin Dashboard</h1>
            <p className='my-2'>Welcome, {session.user.name}! You can manage the game here.</p>
            <Link className='bg-rose-500 py-1 px-2 my-2' href="/admin/atable">View Chart</Link>
            {/* Links */}
            <div className='flex justify-between items-center p-5 border m-2'>
                <Link className='border p-2' href="/admin/player">Player</Link>
                <Link className='border p-2' href="/admin/balance">Balance</Link>
                <Link className='border p-2' href="/admin/requests">Add</Link>
                <Link className='border p-2' href="/admin/result">Result</Link>
            </div>

        </div>
    );
}
