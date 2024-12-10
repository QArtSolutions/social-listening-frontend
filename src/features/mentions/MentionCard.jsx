import React from 'react';
import '../../styles/MentionCard.css'; // Ensure your CSS is imported

const MentionCard = ({ mention, isInstagram, isFacebook }) => {
  if (!mention) {
    return <div className="mention-card">No mention data available</div>;
  }

  const platformName = mention.source;
  // isInstagram
  //   ? 'Instagram'
  //   : isFacebook
  //   ? 'Facebook'
  //   : 'Twitter';

  // Determine tag text and style dynamically
  const isFilteredText =
  mention.Sentiment === 'positive'
    ? 'Positive'
    : mention.Sentiment === 'negative'
    ? 'Negative'
    : 'Neutral';

const isFilteredClass =
  mention.Sentiment === 'positive'
    ? 'mention-card-tag-yes'
    : mention.Sentiment === 'negative'
    ? 'mention-card-tag-no'
    : 'mention-card-tag-neutral';

// Get user image or fallback to a default avatar
const userImage = mention.profile_image_url || './profile image.jpg'; 

return (
  <div className="mention-card">
    {/* Card Header */}
    <div className="mention-card-header">
      <img
        src={userImage}
        alt={`${mention.username || 'Unknown User'}'s profile`}
        className="mention-card-user-image"
      />
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
     
     {/* Images */}
     {/* {mention.images && mention.images.length > 0 && (
          <div className="mention-card-images">
            {mention.images.map((image, index) => (
              <img
                key={index}
                src={getProxiedImageUrl(image)}
                alt={`Mention image ${index + 1}`}
                className="mention-card-image"
              />
            ))}
          </div>
        )} */}

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