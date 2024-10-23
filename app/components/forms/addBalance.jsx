// app/components/forms/addBalance.jsx

'use client';

import { useState, useEffect } from 'react';

export default function AddBalance() {
  const [formData, setFormData] = useState({
    email: '',
    balance: 0,
  });
  const [currentBalance, setCurrentBalance] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [playerEmails, setPlayerEmails] = useState([]);

  // Fetch player emails on component mount
  useEffect(() => {
    const fetchPlayerEmails = async () => {
      try {
        const response = await fetch('/api/player'); // Assuming you have an API endpoint to fetch all players
        const data = await response.json();
        if (response.ok) {
          setPlayerEmails(data.map((player) => player.email)); // Extracting emails from the data
        }
      } catch (error) {
        console.error('Error fetching player emails:', error);
      }
    };

    fetchPlayerEmails();
  }, []);

  // Fetch player's current balance when the email changes
  useEffect(() => {
    const fetchPlayerBalance = async () => {
      if (formData.email) {
        try {
          const response = await fetch(`/api/player?email=${formData.email}`);
          const data = await response.json();
          if (response.ok && data.length > 0) {
            setCurrentBalance(data[0].balance);
          } else {
            setCurrentBalance(null);
          }
        } catch (error) {
          console.error('Error fetching player balance:', error);
          setCurrentBalance(null);
        }
      }
    };

    fetchPlayerBalance();
  }, [formData.email]);

  // Update the sum of current and new balance
  useEffect(() => {
    if (currentBalance !== null) {
      setTotalBalance(parseFloat(currentBalance) + parseFloat(formData.balance));
    }
  }, [currentBalance, formData.balance]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          balance: totalBalance, // Submit the sum as the new balance
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Balance updated successfully!');
        setFormData({
          email: '',
          balance: 0,
        });
        setCurrentBalance(null);
        setTotalBalance(0);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      alert('An error occurred while updating the balance.');
    }
  };

  return (
    <div className='sm:hidden'>
      <form onSubmit={handleSubmit} className="text-black">
        <h1 className="text-white text-2xl underline">Update Player Balance</h1>

        <div>
          <label className="text-white" htmlFor="email">Player Email</label>
          <select
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-black bg-rose-600 px-3 py-2 border rounded"
            required
          >
            <option value="">Select Player Email</option>
            {playerEmails.map((email, index) => (
              <option key={index} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        {/* Display current balance if found */}
        {currentBalance !== null && (
          <div>
            <label className="text-white" htmlFor="currentBalance">Current Balance</label>
            <input
              type="number"
              value={currentBalance}
              readOnly
              className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
            />
          </div>
        )}

        <div>
          <label className="text-white" htmlFor="balance">New Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
            placeholder="New Balance"
            required
          />
        </div>

        {/* Display total balance */}
        <div>
          <label className="text-white" htmlFor="totalBalance">Total Balance (Current + New)</label>
          <input
            type="number"
            value={totalBalance}
            readOnly
            className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
          />
        </div>

        <button type="submit" className="mt-2 bg-rose-600 p-2 text-white mt-3">Submit</button>
      </form>
    </div>
  );
}
