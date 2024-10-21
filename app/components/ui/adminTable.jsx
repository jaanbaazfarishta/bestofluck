// app/components/adminTable.jsx

'use client';
import React, { useEffect, useState } from 'react';

export default function AdminTable() {
  const [game, setGame] = useState([]);
  const [numberData, setNumberData] = useState(
    Array.from({ length: 10 }, (_, i) => ({ number: i + 1, totalPoints: 0, totalReturns: 0 }))
  );

  useEffect(() => {
    async function fetchGame() {
      try {
        const response = await fetch('/api/table', { cache: 'no-store' });  // Disable cache
        const data = await response.json();
        setGame(data);
  
        // Create a copy of the numberData state for modifying points and returns
        const updatedNumberData = Array.from({ length: 10 }, (_, i) => ({ number: i + 1, totalPoints: 0, totalReturns: 0 }));
  
        // Loop through the fetched game data
        data.forEach((gameItem) => {
          gameItem.selectedNumbers.forEach((numObj) => {
            const { number, points, returningPoints } = numObj;
  
            // Update the total points and returns for the corresponding number
            if (number >= 1 && number <= 10) {
              updatedNumberData[number - 1].totalPoints += points;
              updatedNumberData[number - 1].totalReturns += returningPoints;
            }
          });
        });
  
        // Set the updated totals in state
        setNumberData(updatedNumberData);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }
  
    fetchGame();
  }, []);  


  return (
    <div className='sm:hidden'>
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Number</th>
            <th className="border border-gray-300 px-4 py-2">Points</th>
            <th className="border border-gray-300 px-4 py-2">Returns</th>
          </tr>
        </thead>
        <tbody>
          {numberData.map((entry) => (
            <tr key={entry.number}>
              <td className="border border-gray-300 px-4 py-2">{entry.number}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.totalPoints}</td>
              <td className="border border-gray-300 px-4 py-2">{entry.totalReturns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

