// app/components/ui/adminTable.jsx

'use client';
import React, { useEffect, useState } from 'react';

export default function AdminTable() {
  const [allPlayersData, setAllPlayersData] = useState([]); // To store data for all players

  // Function to fetch game data for all players
  const fetchAllPlayersData = async () => {
    try {
      const response = await fetch(`/api/table`, { cache: 'no-store' });  // Fetch fresh data from the server
      const data = await response.json();

      if (response.ok) {
        const combinedData = data.flatMap(game => game.selectedNumbers); // Flatten the selectedNumbers array from each player's game data
        setAllPlayersData(combinedData);
      } else {
        console.error('Failed to fetch players data');
      }
    } catch (error) {
      console.error('Error fetching players data:', error);
    }
  };

  useEffect(() => {
    fetchAllPlayersData();
  }, []);

  // Create an object to sum points for each number across all players
  const pointsMap = allPlayersData.reduce((acc, entry) => {
    if (acc[entry.number]) {
      acc[entry.number] += entry.points; // Sum points for the same number
    } else {
      acc[entry.number] = entry.points; // Initialize points for this number
    }
    return acc;
  }, {});

  return (
    <div className='sm:hidden'>
      <h3>Aggregated Numbers for All Players</h3>
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Number</th>
            <th className="border border-gray-300 px-4 py-2">Total Points</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10).keys()].map(num => (
            <tr key={num + 1}>
              <td className="border border-gray-300 px-4 py-2">{num + 1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {pointsMap[num + 1] || 0} {/* Show sum of points or 0 if number not selected */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
