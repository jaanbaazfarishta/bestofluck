// app/components/ui/footer.jsx


import React from 'react';
import Game from './game';

export default function Footer({ showFooter }) {
  if (!showFooter) return null;

  return (
    <div className='sm:hidden'>
      <Game/>
    </div>
  );
}
