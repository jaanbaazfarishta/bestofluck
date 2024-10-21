// app/components/forms/addNumber.jsx

'use client';

import { useState } from 'react';

export default function AddNumber() {
  const [formData, setFormData] = useState({
    number: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);

        // Fetch the players who selected this number
        const emailResponse = await fetch(`/api/game?number=${formData.number}`);
        const emailData = await emailResponse.json();

        // Update player balance for each email
        for (const player of emailData) {
          const balanceUpdateResponse = await fetch('/api/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: player.email,
              balance: player.balance + player.returningPoints, // Add returning points
            }),
          });

          const balanceUpdateResult = await balanceUpdateResponse.json();
          if (!balanceUpdateResponse.ok) {
            alert(`Failed to update balance for ${player.email}`);
          }
        }

        // Delete all documents from the game collection after processing
        await fetch('/api/game', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Clear the form fields after successful submission
        setFormData({
          number: 0,
        });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div className="sm:hidden">

      <form onSubmit={handleSubmit} className="text-black">
        <h1 className="text-white text-2xl underline">Add Result</h1>
        <div className=''>
          <div className="">
            <label className="text-white" htmlFor="number">Enter Number</label>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full bg-rose-500 text-black font-bold px-3 py-2 border rounded"
              placeholder="0"
            />
          </div>
        </div>
        <button type="submit" className="text-white">Submit</button>
      </form>

    </div>
  );
}
