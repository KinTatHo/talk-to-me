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
        console.log('User data:', user);
        const learningLanguages = user?.learningLanguages || [];
        console.log('Learning languages:', learningLanguages);

        if (learningLanguages.length === 0) {
          console.log('No learning languages found. Fetching all tutors.');
          const response = await axios.get('http://localhost:3001/api/tutors');
          setTutors(response.data);
        } else {
          const responses = await Promise.all(
            learningLanguages.map(lang => 
              axios.get(`http://localhost:3001/api/tutors?language=${lang}`)
            )
          );
          
          console.log('API responses:', responses);

          const allTutors = responses.flatMap(response => response.data);
          console.log('All tutors:', allTutors);

          const uniqueTutors = Array.from(new Set(allTutors.map(t => t.id)))
            .map(id => allTutors.find(t => t.id === id));
          
          console.log('Unique tutors:', uniqueTutors);
          setTutors(uniqueTutors);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setError('Failed to fetch tutors. Please try again later.');
        setLoading(false);
      }
    };

    fetchTutors();
  }, [user]);

  if (loading) return <div className="text-center mt-8">Loading tutors...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Tutors</h2>
      {tutors.length === 0 ? (
        <p>No tutors available for your learning languages at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{tutor.username}</h3>
              <p className="text-gray-600 mb-4">
                Teaching Languages: {tutor.teachingLanguages ? tutor.teachingLanguages.join(', ') : 'Not specified'}
              </p>
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