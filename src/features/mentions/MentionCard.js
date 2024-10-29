import React from 'react';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import '../../styles/MentionCard.css';

const MentionCard = ({ mention }) => {
  return (
    <div className="mention-card">
      <h3 className="mention-title">{mention.title}</h3>
      <div className="mention-info">
        <span className="mention-source">{mention.source}</span>
        <span className="mention-date">{mention.date}</span>
      </div>
      <div className="mention-actions">
        <span><FaThumbsUp /> {mention.likes}</span>
        <span><FaComment /> {mention.comments}</span>
        <span><FaShare /> {mention.shares}</span>
      </div>
    </div>
  );
};

export default MentionCard;