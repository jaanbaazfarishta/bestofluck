// app/component/ui/playertable.jsx

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // For fetching session data

export default function PlayerTable() {
  const { data: session } = useSession(); // Get the session data
  const [gameData, setGameData] = useState([]); // State to hold the game data

  // Function to fetch game data based on session email
  const fetchGameData = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/ptable?email=${session.user.email}`);
        const data = await response.json();

        if (response.ok) {
          // Combine all game data for summing the points
          const combinedData = data.flatMap(game => game.selectedNumbers); // Get selectedNumbers from each game document
          setGameData(combinedData);
        } else {
          console.error("Failed to fetch game data");
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [session?.user?.email]);

  // Create an object to sum points for each number
  const pointsMap = gameData.reduce((acc, entry) => {
    if (acc[entry.number]) {
      acc[entry.number] += entry.points; // Sum the points for the same number
    } else {
      acc[entry.number] = entry.points; // Initialize the points for the number
    }
    return acc;
  }, {});

  return (
    <div className='sm:hidden'>
      <h3>Your Numbers</h3>
      <table className='GuessTable'>
        <thead>
          <tr className='bg-rose-600'>
            {[...Array(10).keys()].map(num => (
              <td key={num + 1}>{num + 1}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className='bg-amber-700'>
            {[...Array(10).keys()].map(num => (
              <td key={num + 1}>
                {pointsMap[num + 1] || 0} {/* Show sum of points or 0 if number not selected */}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
