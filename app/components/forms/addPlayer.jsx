// app/components/forms/addPlayer.jsx

'use client';

import { useState } from 'react';

export default function AddPlayer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    balance: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Clear the form fields after successful submission
        setFormData({
          name: '',
          email: '',
          balance: 0,
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
        <h1 className="text-white text-2xl underline">Add Player</h1>

        <div className=''>

          <div className="">
            <label className="text-white" htmlFor="name">Player Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Player Name"
            />
          </div>

          <div className="">
            <label className="text-white" htmlFor="email">Email</label>
            <input
            type='mail'
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Email"
            />
          </div>

          <div className="">
            <label className="text-white" htmlFor="balance">Balance</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black bg-rose-500 border rounded"
              placeholder="Balance"
            />
          </div>
        </div>
        <button type="submit" className="text-white">Submit</button>
      </form>

    </div>
  );
}
