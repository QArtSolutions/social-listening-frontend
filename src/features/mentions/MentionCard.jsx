import React from 'react';
import '../../styles/MentionCard.css'; // Ensure your CSS is imported

const MentionCard = ({ mention, isInstagram, isFacebook }) => {
  if (!mention) {
    return <div className="mention-card">No mention data available</div>;
  }

  const platformName = isInstagram
    ? 'Instagram'
    : isFacebook
    ? 'Facebook'
    : 'Twitter';

  // Determine tag text and style dynamically
  const isFilteredText = mention.isfiltered === 'Yes' ? 'Positive' : 'Negative';
  const isFilteredClass =
    mention.isfiltered === 'Yes' ? 'mention-card-tag-yes' : 'mention-card-tag-no';

  return (
    <div className="mention-card">
      {/* Card Header */}
      <div className="mention-card-header">
        <h3 className="mention-card-username">{mention.username || 'Unknown User'}</h3>
      </div>

      {/* Card Body */}
      <div className="mention-card-body">
        <p className="mention-card-text">{mention.text || 'No text available'}</p>
        {mention.hashtags && mention.hashtags.length > 0 && (
          <div className="mention-card-hashtags">
            {mention.hashtags.map((tag, index) => (
              <span key={index} className="mention-card-hashtag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mention-card-footer">
        <span className="mention-card-timestamp">
          {mention.timestamp || 'No timestamp available'}
        </span>

        {/* Dynamic Tag */}
        <span className={`mention-card-tag ${isFilteredClass}`}>{isFilteredText}</span>

        <span className="mention-card-platform">{platformName}</span>
      </div>
    </div>
  );
};

export default MentionCard;
