// app/admin/(adminPages)/player/page.js

import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AddPlayer from '@/app/components/forms/addPlayer';
import Link from 'next/link';


export default async function Player() {
    const session = await auth();

    // Agar session nahi hai ya email address "sksmarthubbly@gmail.com" nahi hai, tab redirect karein
    if (!session || session.user.email !== 'jaanbaazfarishta@gmail.com') redirect("/");

    return (
        <div className='sm:hidden text-white text-xl p-10'>
            <Link className='bg-green-600 my-2 rounded py-2 px-4' href="/admin/userRequests">User Request</Link>
            <AddPlayer/>
        </div>
    )
}
