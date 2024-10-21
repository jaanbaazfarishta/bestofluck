// app/components/forms/gameForm.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';  // Import useSession hook to get the session
import PlayerTable from '../ui/playertable';

export default function GameForm() {
  const { data: session } = useSession();  // Get session data
  const [selections, setSelections] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1); // Initially, only 1 dropdown is visible
  const [availableNumbers, setAvailableNumbers] = useState([...Array(10).keys()].map((num) => num + 1)); // 1 to 10
  const [balance, setBalance] = useState(null); // Player's current balance

  // Fetch player's current balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/player?email=${session.user.email}`);
          const data = await response.json();
          if (response.ok && data.length > 0) {
            setBalance(data[0].balance);  // Set player's current balance
          } else {
            setBalance(null);
          }
        } catch (error) {
          console.error('Error fetching player balance:', error);
          setBalance(null);
        }
      }
    };
    fetchBalance();
  }, [session?.user?.email]);

  const handleNumberChange = (index, value) => {
    const updatedSelections = [...selections];
    const previousNumber = updatedSelections[index]?.number;

    if (!updatedSelections[index]) {
      updatedSelections[index] = { number: value, points: '', returningPoints: 0 };
    } else {
      updatedSelections[index].number = value;
    }

    setSelections(updatedSelections);

    let updatedAvailableNumbers = [...availableNumbers];

    if (previousNumber) {
      updatedAvailableNumbers = [...updatedAvailableNumbers, previousNumber];
    }

    updatedAvailableNumbers = updatedAvailableNumbers.filter((num) => num !== parseInt(value));
    setAvailableNumbers(updatedAvailableNumbers);
  };

  const handlePointsChange = (index, value) => {
    const updatedSelections = [...selections];

    // Check for valid points
    if (parseInt(value) < 0 || isNaN(value)) {
      alert("Please enter a valid positive number for points.");
      return;
    }

    if (updatedSelections[index]) {
      updatedSelections[index].points = value;
      updatedSelections[index].returningPoints = value * 9;
    }
    setSelections(updatedSelections);
    calculateTotalPoints(updatedSelections);

    if (value && visibleCount === index + 1 && index < 9) {
      setVisibleCount(visibleCount + 1);
    }
  };

  const calculateTotalPoints = (updatedSelections) => {
    const total = updatedSelections.reduce((sum, selection) => {
      return sum + (parseInt(selection.points) || 0);
    }, 0);
    setTotalPoints(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email || balance === null) {
      alert('Player not found or balance not loaded.');
      return;
    }

    if (totalPoints > balance) {
      alert('Insufficient balance!');
      return;
    }

    try {
      // Send game data (selected numbers, points, and email) to the backend to store in the Game model
      const gameData = {
        email: session.user.email,
        selectedNumbers: selections,  // Send the selected numbers and points
      };

      const gameResponse = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      const gameResult = await gameResponse.json();
      if (!gameResponse.ok) {
        alert(gameResult.error);
        return;
      }

      // Update player's balance in the database
      const balanceResponse = await fetch('/api/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          balance: balance - totalPoints, // Subtract total points from current balance
        }),
      });

      const balanceResult = await balanceResponse.json();
      if (balanceResponse.ok) {
        alert('Game submitted successfully, Best of Luck!');
        setSelections([]);
        setTotalPoints(0);
        setVisibleCount(1);
        setAvailableNumbers([...Array(10).keys()].map((num) => num + 1)); // Reset available numbers
        setBalance(balance - totalPoints); // Update the balance in the state
        // Reload the page after success
        window.location.reload();
      } else {
        alert(balanceResult.error);
      }

    } catch (error) {
      console.error('Error submitting game data:', error);
      alert('An error occurred while submitting the game data.');
    }
  };

  return (
    <div className="sm:hidden text-white">
      <h1 className="text-2xl mb-4 underline">Select Number</h1>
      <form onSubmit={handleSubmit}>
        {[...Array(10)].map((_, index) => (
          index < visibleCount && (
            <div key={index} className="mb-4 flex items-center">
              <select
                value={selections[index]?.number || ''}
                onChange={(e) => handleNumberChange(index, e.target.value)}
                className="w-1/4 px-3 py-2 border text-black rounded"
              >
                <option className='text-black' value="">Choose a Number</option>
                {[
                  selections[index]?.number,
                  ...availableNumbers.filter(num => num !== selections[index]?.number)
                ].map((num) => (
                  <option className='text-black' key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>

              {selections[index]?.number && (
                <input
                  type="number"
                  placeholder="Enter points"
                  value={selections[index]?.points || ''}
                  onChange={(e) => handlePointsChange(index, e.target.value)}
                  className="w-1/4 bg-amber-400 text-black px-3 py-2 border rounded mx-2"
                />
              )}

              {selections[index]?.points && (
                <div className="px-3 py-2 border rounded bg-rose-500 mx-2">
                  {selections[index].returningPoints}
                </div>
              )}
            </div>
          )
        ))}

        <div className="flex items-center mt-4">
          <button type="submit" className="px-4 py-2 bg-green-600 rounded text-white">
            Submit
          </button>

          <div className="ml-4 px-3 py-2 border rounded bg-rose-500">
            Total Points: {totalPoints}
          </div>
        </div>
      </form>
      <div className='w-full mt-1'>
        <PlayerTable/>
      </div>
    </div>
  );
}
