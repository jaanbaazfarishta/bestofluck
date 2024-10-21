// app/admin/(adminPages)/result/page.js

import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AddNumber from '@/app/components/forms/addNumber';


export default async function Player() {
    const session = await auth();

    // Agar session nahi hai ya email address "sksmarthubbly@gmail.com" nahi hai, tab redirect karein
    if (!session || session.user.email !== 'jaanbaazfarishta@gmail.com') redirect("/");

    return (
        <div className='sm:hidden text-white text-xl p-10'>
            <AddNumber/>
        </div>
    )
}
