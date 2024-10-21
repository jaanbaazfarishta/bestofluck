// app/components/forms/addUser.jsx

'use client';

import { useState } from 'react';

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user', {
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
        });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error Registering:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div className="sm:hidden">

      <form onSubmit={handleSubmit} className="text-black">
        <h1 className="text-white text-2xl underline">Register Yourself</h1>

        <div className=''>

          <div className="">
            <label className="text-white" htmlFor="name">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Your Name"
            />
          </div>

          <div className="">
            <label className="text-white" htmlFor="email">Your Email</label>
            <input
            type='mail'
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Your Email"
            />
          </div>

        </div>
        <button type="submit" className="bg-green-500 py-1 px-2 mt-2 text-white">Submit</button>
      </form>

    </div>
  );
}
