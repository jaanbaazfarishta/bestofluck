// app/components/RegisterButton.jsx

import Link from 'next/link';
import React from 'react';

export default function RegisterButton({ hideRegisterButton }) {
  if (hideRegisterButton) return null; // Hide button if flag is true

  return (
    <div className='sm:hidden bg-green-400 flex justify-center items-center p-2'>
      <Link className="text-xl bg-rose-600 p-2 rounded font-bold text-black" href="/user">Register Now</Link>
    </div>
  );
}
