'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import NextAuth hook

export default function AddBalance() {
  const { data: session } = useSession(); // Get session data

  const [formData, setFormData] = useState({
    emailFrom: '',
    emailTo: '',
    balance: '',
  });
  const [balanceFrom, setBalanceFrom] = useState(null);
  const [balanceTo, setBalanceTo] = useState(null);
  const [totalBalanceTo, setTotalBalanceTo] = useState(0);
  const [allEmails, setAllEmails] = useState([]); // To store all player emails

  // Fetch all player emails for the select dropdown
  useEffect(() => {
    const fetchAllEmails = async () => {
      try {
        const response = await fetch('/api/player'); // Assuming your API returns all players
        const data = await response.json();
        if (response.ok) {
          setAllEmails(data.map(player => player.email));
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchAllEmails();
  }, []);

  useEffect(() => {
    if (session) {
      setFormData({ ...formData, emailFrom: session.user.email });
    }
  }, [session]);

  // Fetch balance for both emailFrom and emailTo
  useEffect(() => {
    const fetchPlayerBalanceFrom = async () => {
      if (formData.emailFrom) {
        try {
          const response = await fetch(`/api/player?email=${formData.emailFrom}`);
          const data = await response.json();
          if (response.ok && data.length > 0) {
            setBalanceFrom(data[0].balance);
          } else {
            setBalanceFrom(null);
          }
        } catch (error) {
          console.error('Error fetching player balance:', error);
          setBalanceFrom(null);
        }
      }
    };

    const fetchPlayerBalanceTo = async () => {
      if (formData.emailTo) {
        try {
          const response = await fetch(`/api/player?email=${formData.emailTo}`);
          const data = await response.json();
          if (response.ok && data.length > 0) {
            setBalanceTo(data[0].balance);
          } else {
            setBalanceTo(null);
          }
        } catch (error) {
          console.error('Error fetching player balance:', error);
          setBalanceTo(null);
        }
      }
    };

    fetchPlayerBalanceFrom();
    fetchPlayerBalanceTo();
  }, [formData.emailFrom, formData.emailTo]);

  // Update the total balance for emailTo
  useEffect(() => {
    if (balanceTo !== null) {
      setTotalBalanceTo(parseFloat(balanceTo) + parseFloat(formData.balance));
    }
  }, [balanceTo, formData.balance]);

  const handleChange = (e) => {
    // Prevent negative numbers for balance
    if (e.target.name === 'balance' && e.target.value < 0) {
      alert('Amount cannot be negative!');
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (parseFloat(formData.balance) <= 0) {
      alert('Transfer amount must be greater than zero.');
      return;
    }
    if (parseFloat(formData.balance) > parseFloat(balanceFrom)) {
      alert('You cannot transfer more than your current balance.');
      return;
    }

    try {
      // Update balance for emailFrom (deducting balance)
      const responseFrom = await fetch('/api/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.emailFrom,
          balance: parseFloat(balanceFrom) - parseFloat(formData.balance), // Deduct balance
        }),
      });

      // Update balance for emailTo (adding balance)
      const responseTo = await fetch('/api/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.emailTo,
          balance: totalBalanceTo, // Add balance
        }),
      });

      const dataFrom = await responseFrom.json();
      const dataTo = await responseTo.json();
      if (responseFrom.ok && responseTo.ok) {
        alert('Balance transferred successfully!');
        setFormData({
          emailFrom: session.user.email, // Reset emailFrom to session email
          emailTo: '',
          balance: '',
        });
        setBalanceFrom(null);
        setBalanceTo(null);
        setTotalBalanceTo(0);
      } else {
        alert(dataFrom.error || dataTo.error);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      alert('An error occurred while transferring the balance.');
    }
  };

  return (
    <div className='sm:hidden'>
      <form onSubmit={handleSubmit} className="text-black">
        <h1 className="text-white text-2xl underline">Transfer Balance</h1>

        <div>
          <label className="text-white" htmlFor="emailFrom">Your Email</label>
          <input
            type="email"
            name="emailFrom"
            value={formData.emailFrom}
            readOnly
            className="w-full text-black bg-rose-600 px-3 py-2 border rounded"
            placeholder="Your Email"
            required
          />
        </div>

        {/* Display current balance for emailFrom */}
        {balanceFrom !== null && (
          <div>
            <label className="text-white" htmlFor="balanceFrom">Your Balance</label>
            <input
              type="number"
              value={balanceFrom}
              readOnly
              className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
            />
          </div>
        )}

        <div>
          <label className="text-white" htmlFor="emailTo">Select Player Email (To)</label>
          <select
            name="emailTo"
            value={formData.emailTo}
            onChange={handleChange}
            className="w-full text-black bg-rose-600 px-3 py-2 border rounded"
            required
          >
            <option value="" disabled>Select Player Email</option>
            {allEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        {/* Display current balance for emailTo */}
        {balanceTo !== null && (
          <div>
            <label className="text-white" htmlFor="balanceTo">His Current Balance</label>
            <input
              type="number"
              value={balanceTo}
              readOnly
              className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
            />
          </div>
        )}

        <div>
          <label className="text-white" htmlFor="balance">Amount to Transfer</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
            placeholder="Amount to Transfer"
            required
          />
        </div>

        {/* Display total balance for emailTo */}
        <div>
          <label className="text-white" htmlFor="totalBalanceTo">His New Balance</label>
          <input
            type="number"
            value={totalBalanceTo}
            readOnly
            className="w-full px-3 py-2 text-black bg-rose-600 border rounded"
          />
        </div>

        <button type="submit" className="bg-green-500 py-1 px-2 mt-2 text-white">Submit</button>
      </form>
    </div>
  );
}
