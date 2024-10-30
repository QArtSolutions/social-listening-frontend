import React, { useState, useEffect, startTransition } from 'react';
import MentionsChart from './MentionsChart';
import MentionCard from './MentionCard';
import { fetchMockMentions } from '../../services/api/mentionsApi';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { useBrand } from '../../contexts/BrandContext';
import '../../styles/MentionsPage.css';

const MentionsPage = () => {
  const [mentions, setMentions] = useState([]);
  const { brand } = useBrand();

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const data = await fetchMockMentions();
        startTransition(() => {
            setMentions(data);
        });
      } catch (error) {
        console.error('Error fetching mentions:', error);
      }
    };
    fetchData();
  }, []);

  console.log("Brand in MentionsPage:", {brand}); // Log to confirm brand value in MentionsPage


  return (
    <div className="mentions-page">
      <Header />
      <Sidebar projectName= {brand || 'brand not set'}/>   
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
