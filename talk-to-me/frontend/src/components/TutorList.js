import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese'];

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tutors');
        setTutors(response.data);
        setFilteredTutors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setError('Failed to fetch tutors. Please try again later.');
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  useEffect(() => {
    if (filterLanguage) {
      setFilteredTutors(tutors.filter(tutor => 
        tutor.teachingLanguages && tutor.teachingLanguages.includes(filterLanguage)
      ));
    } else {
      setFilteredTutors(tutors);
    }
  }, [filterLanguage, tutors]);

  if (loading) return <div className="text-center mt-8">Loading tutors...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Tutors</h2>
      <div className="mb-4">
        <label htmlFor="language-filter" className="block mb-2">Filter by Language:</label>
        <select
          id="language-filter"
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="w-full md:w-auto px-3 py-2 border rounded"
        >
          <option value="">All Languages</option>
          {languageOptions.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      {filteredTutors.length === 0 ? (
        <p>No tutors available for the selected criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
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