// app/components/ui/navbar.jsx

import Image from 'next/image'
import React from 'react'
import { SignIn, SignOut } from './sign'
import { auth } from '@/auth';
import Balance from './balance';
import Link from 'next/link';


export default async function Navbar() {
  const session = await auth();
  return (
    <div className='sm:hidden'>
      {session && session.user && session.user.name ? (
        <div className='flex min-w-full p-4 justify-between items-center border-2'>
          <div>
            <Image src={session.user.image.startsWith('http') ? session.user.image : `/${session.user.image}`}
              width={32}
              height={32}
              alt="Profile Picture"
            />
          </div>
          <div><h2>{session.user.name}</h2></div>
          <div>
            <details>
              <summary className='list-none'>
                <Balance email={session.user.email} />
              </summary>
              <ul className='absolute bg-rose-600 p-4'>
                <li>
                  <Link href="/add">Add</Link>
                </li>
                <li>
                  <Link href="/withdraw">Withdraw</Link>
                </li>
                <li>
                  <Link href="/transferbalance">Transfer</Link>
                </li>
              </ul>
            </details>
          </div>
          <div className='border p-1 border-black rounded bg-[#A9D7D5]'><SignOut /></div>
        </div>
      ) : (
        <div className='flex min-w-full p-4 justify-center items-center border-2'>
          <SignIn />
        </div>
      )}
    </div>

  )
}