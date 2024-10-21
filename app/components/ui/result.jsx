// app/components/ui/result.jsx

'use client';

import React, { useState, useEffect } from 'react';

export default function Result() {
    const [numbers, setNumbers] = useState([]);

    // Fetch numbers from the API on component mount
    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                const response = await fetch('/api/number');
                const data = await response.json();

                // Sorting the numbers in reverse order based on `createdAt`
                const sortedNumbers = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                // Only take the first 10 numbers (if more are fetched)
                setNumbers(sortedNumbers.slice(0, 10));
            } catch (error) {
                console.error('Error fetching numbers:', error);
            }
        };

        fetchNumbers();
    }, []);

    return (
        <div className="sm:hidden flex flex-col justify-center gap-2 items-center p-5">
            <h1 className="text-center items-center text-9xl p-4 bg-green-600 border rounded">
                {numbers.length > 0 ? numbers[0].number : 'N/A'}
            </h1>
            <table className="mainTable">
                <thead className="font-bold">
                    <tr>
                        <td colSpan={10}>Recent Results</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {numbers.map((num, index) => (
                            <td
                                key={index}
                                className={index === 0 ? "bg-green-600 text-white" : ""} // Added class for the first column
                            >
                                {num.number}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
