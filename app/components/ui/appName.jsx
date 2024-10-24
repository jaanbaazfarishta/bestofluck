// app/components/appName.jsx

import Link from 'next/link'
import React from 'react'

export default function Banner() {
    return (
        <div className='sm:hidden flex min-w-full hover:bg-[#d8827a] bg-[#E9A19B] p-4 justify-center items-center border-2'>
            <Link className='text-4xl font-bold tracking-widest text-[#D2EFEB] hover:text-white' href="/">Best of Luck</Link>
        </div>
    )
}
