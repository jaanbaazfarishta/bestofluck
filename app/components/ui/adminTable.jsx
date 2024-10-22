// app/components/adminTable.jsx

'use client';
import React, { useEffect, useState } from 'react';

export default function AdminTable() {
  const [game, setGame] = useState([]);

  useEffect(() => {
    async function fetchGame() {
      try {
        const response = await fetch('/api/table', { cache: 'no-store' });  // Disable cache
        const data = await response.json();
        
        // Call the function to aggregate the data
        const aggregatedData = aggregateNumbers(data);
        setGame(aggregatedData);
        // console.log(aggregatedData);
        // For debugging

      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }

    fetchGame();
  }, []);

  // Function to aggregate the numbers
  const aggregateNumbers = (data) => {
    const result = {};

    data.forEach(gameData => {
      gameData.selectedNumbers.forEach(numObj => {
        const { number, points, returningPoints } = numObj;

        // If the number already exists, sum the points and returning points
        if (result[number]) {
          result[number].points += points;
          result[number].returningPoints += returningPoints;
        } else {
          // If number doesn't exist, create a new entry
          result[number] = { number, points, returningPoints };
        }
      });
    });

    // Convert the result object into an array
    return Object.values(result);
  };

  return (
    <div className='sm:hidden'>
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Number</th>
            <th className="border border-gray-300 px-4 py-2">Points</th>
            <th className="border border-gray-300 px-4 py-2">Return</th>
          </tr>
        </thead>
        <tbody>
          {game.map((numData, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{numData.number}</td>
              <td className="border border-gray-300 px-4 py-2">{numData.points}</td>
              <td className="border border-gray-300 px-4 py-2">{numData.returningPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
