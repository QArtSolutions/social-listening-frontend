// MentionCard.js
import React from 'react';
import '../../styles/MentionCard.css';

const MentionCard = ({ mention }) => {
  // Accessing user details
  const user = mention?.core?.user_results?.result?.legacy || {};
  const userName = user?.name || "Unknown user";
  const userDescription = user?.description || "No description available";
  const userProfileImage = user?.profile_image_url_https || "default-image-url.jpg";

  // Accessing tweet details
  const tweetText = mention?.legacy?.full_text || "No text available";
  const createdAt = mention?.legacy?.created_at || "Unknown date";
  const likeCount = mention?.legacy?.favorite_count || 0;
  const retweetCount = mention?.legacy?.retweet_count || 0;

  return (
    <div className="mention-card">
      <div className="mention-card-header">
        <img src={userProfileImage} alt={`${userName}'s profile`} className="profile-image" />
        <div className="user-info">
          <h3 className="user-name">{userName}</h3>
          <p className="user-description">{userDescription}</p>
        </div>
      </div>
      <div className="mention-card-body">
        <p className="tweet-text">{tweetText}</p>
      </div>
      <div className="mention-card-footer">
        <span className="created-at">{createdAt}</span>
        <span className="like-count">Likes: {likeCount}</span>
        <span className="retweet-count">Retweets: {retweetCount}</span>
      </div>
    </div>
  );
};

export default MentionCard;
