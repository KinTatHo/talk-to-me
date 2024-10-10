import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const language = user?.language || '';
        const response = await axios.get(`http://localhost:3001/api/tutors${language ? `?language=${language}` : ''}`);
        setTutors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setError('Failed to fetch tutors. Please try again later.');
        setLoading(false);
      }
    };

    fetchTutors();
  }, [user?.language]);

  if (loading) return <div className="text-center mt-8">Loading tutors...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Tutors {user?.language ? `for ${user.language}` : ''}</h2>
      {tutors.length === 0 ? (
        <p>No tutors available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{tutor.username}</h3>
              <p className="text-gray-600 mb-4">Language: {tutor.language}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Book Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorList;