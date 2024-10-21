// app/add/page.js

'use client';

import { useState } from 'react';

export default function Withdraw() {

  const [formData, setFormData] = useState({
    playerupi: '',
    upi: 'withdraw',
    utr: 'withdraw',
    email: '',
    balance: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add', {
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
          playerupi: '',
          upi: 'withdraw',
          utr: 'withdraw',
          email: '',
          balance: '',
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
    <div className='sm:hidden flex flex-col ju items-center p-4 gap-4'>
      <div>
        <p className='text-justify'>Withdrawl can take 5 minutes to 60 minutes</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="text-black">
          <h1 className="text-white text-2xl underline">Withdraw Balance</h1>

          <div className=''>

            <div className="">
              <label className="text-white" htmlFor="playerupi">Your UPI ID</label>
              <input
                type="text"
                name="playerupi"
                value={formData.playerupi}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border rounded"
                placeholder=""
              />
            </div>

            <div className="hidden">
              <label className=" text-white" htmlFor="upi">Selected UPI ID</label>
              <input
                type="text"
                name="upi"
                value={formData.upi}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border rounded"
                placeholder="withdraw"
              />
            </div>

            <div className="hidden">
              <label className="text-white" htmlFor="utr">Trasaction ID or UTR No.</label>
              <input
                type="text"
                name="utr"
                value={formData.utr}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border rounded"
                placeholder=""
              />
            </div>

            <div className="">
              <label className="text-white" htmlFor="email">Your Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border rounded"
                placeholder=""
              />
            </div>

            <div className="">
              <label className="text-white" htmlFor="balance">Amount</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black bg-rose-500 border rounded"
                placeholder=""
                min={200}  // Minimum value set kiya
                max={5000} // Maximum value set kiya
              />
            </div>
          </div>
          <button type="submit" className="bg-green-500 py-1 px-2 mt-2 text-white">Submit</button>
        </form>
      </div>
    </div>
  )
}
