import React, { useState, useEffect } from 'react';
import MentionsChart from './MentionsChart';
import MentionCard from './MentionCard';
import { fetchMockMentions } from '../../services/api/mentionsApi';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import '../../styles/MentionsPage.css';

const MentionsPage = () => {
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    const data = fetchMockMentions();
    setMentions(data);
  }, []);

  return (
    <div className="mentions-page">
      <Header />  
      <Sidebar />
      <div className="mentions-content">
        <h2>Total Mentions</h2>
        <MentionsChart />
        <div className="mentions-list">
          {mentions.map(mention => (
            <MentionCard key={mention.id} mention={mention} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentionsPage;
