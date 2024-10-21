// app/components/ui/balance.jsx

'use client';

import React, { useEffect, useState } from 'react';

export default function Balance({ email }) {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch(`/api/player?email=${email}`);
                const data = await response.json();

                if (data.length > 0) {
                    setBalance(data[0].balance); // Assuming data is an array and we want the balance of the first matching player
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        if (email) {
            fetchBalance();
        }
    }, [email]);

    return (
        <div className='sm:hidden'>
            <h2>{balance > 0 ? balance.toFixed(2) : 'Empty'}</h2> {/* Default message */}
        </div>
    );
}
