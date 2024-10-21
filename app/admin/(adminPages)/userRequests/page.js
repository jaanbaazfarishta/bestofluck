'use client';
import React, { useEffect, useState } from 'react';

export default function UserRequests() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        async function fetchUser() {
          try {
            const response = await fetch('/api/user');
            const data = await response.json();
            setUser(data);
            // console.log(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
        fetchUser();
      }, []);

    const handleDelete = async (id) => {
      const confirmed = window.confirm('Are you sure you want to delete this record?'); // Confirmation dialog
      if (!confirmed) return;

      try {
        const response = await fetch('/api/user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // Sending the ID of the row to delete
        });

        if (response.ok) {
          // After deletion, remove the deleted row from the state
          setUser(user.filter(player => player._id !== id));
        } else {
          console.error('Failed to delete the user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full table-auto border-collapse border border-gray-300'>
        <thead>
            <tr className=' bg-gray-400'>
                <th className='text-black border border-gray-300 px-4 py-2'>Name</th>
                <th className='text-black border border-gray-300 px-4 py-2'>Email</th>
                <th className='text-black border border-gray-300 px-4 py-2'>Action</th>
            </tr>
        </thead>
        <tbody>
            {user.map((player) => (
              <tr 
                key={player._id}
                className={`${player.utr === 'withdraw' ? 'bg-red-500' : 'bg-green-400'} text-center`}
              >
                <td className='text-black border border-gray-300 px-4 py-2'>{player.name}</td>
                <td className='border text-black border-gray-300 px-4 py-2'>{player.email}</td>
                <td className='border text-black border-gray-300'>
                    <button
                      className='bg-rose-600 px-2 rounded'
                      onClick={() => handleDelete(player._id)} // Handle delete on click
                    >
                      Del
                    </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
