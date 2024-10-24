// app/component/ui/playertable.jsx

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // For fetching session data

export default function PlayerTable() {
  const { data: session } = useSession(); // Get the session data
  const [gameData, setGameData] = useState([]); // State to hold the game data
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is admin

  const adminEmail = "jaanbaazfarishta@gmail.com"; // Replace with actual admin email

  // Function to fetch game data
  const fetchGameData = async () => {
    if (session?.user?.email) {
      try {
        let response;

        // If admin, fetch all data; else fetch based on user email
        if (session.user.email === adminEmail) {
          response = await fetch(`/api/ptable`); // Fetch all players' data for admin
          setIsAdmin(true); // Set the user as admin
        } else {
          response = await fetch(`/api/ptable?email=${session.user.email}`); // Fetch data for logged-in user
        }

        const data = await response.json();

        if (response.ok) {
          // Combine all game data for summing the points
          const combinedData = data.flatMap(game => game.selectedNumbers); // Get selectedNumbers from each game document
          setGameData(combinedData);
          console.log(combinedData);
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
      acc[entry.number].points += entry.points; // Sum the points for the same number
      acc[entry.number].returningPoints += entry.returningPoints; // Sum the returningPoints for the same number
    } else {
      acc[entry.number] = { 
        points: entry.points, 
        returningPoints: entry.returningPoints 
      }; // Initialize the points and returningPoints for the number
    }
    return acc;
  }, {});

  return (
    <div className='sm:hidden overflow-scroll'>
      <h3>{isAdmin ? "All Players' Numbers" : "Your Numbers"}</h3> {/* Show appropriate heading */}
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
                {pointsMap[num + 1]?.points || 0} {/* Show sum of points or 0 if number not selected */}
              </td>
            ))}
          </tr>
          <tr className='bg-green-500'>
            {[...Array(10).keys()].map(num => (
              <td key={num + 1}>
                {pointsMap[num + 1]?.returningPoints || 0} {/* Show returning points or 0 if not available */}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
