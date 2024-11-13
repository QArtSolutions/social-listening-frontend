import React from 'react';
import '../../styles/MentionCard.css';

const MentionCard = ({ mention, isInstagram = false, isFacebook = false }) => {
  if (!isInstagram && !isFacebook) {
    // Twitter post rendering logic here
    const user = mention?.core?.user_results?.result?.legacy || {};
    const userName = user?.name || "Unknown user";
    const userProfileImage = user?.profile_image_url_https || "default-image-url.jpg";
    const tweetText = mention?.legacy?.full_text || "No text available";
    const createdAt = mention?.legacy?.created_at || "Unknown date";
    const likeCount = mention?.legacy?.favorite_count || 0;

    return (
      <div className="mention-card">
        <div className="mention-card-header">
          <img src={userProfileImage} alt={`${userName}'s profile`} className="profile-image" />
          <div className="user-info">
            <h3 className="user-name">{userName}</h3>
          </div>
        </div>
        <div className="mention-card-body">
          <p className="tweet-text">{tweetText}</p>
        </div>
        <div className="mention-card-footer">
          <span className="created-at">{createdAt}</span>
          <span className="like-count">Likes: {likeCount}</span>
          <span className="platform-name">Source:Twitter</span>
        </div>
      </div>
    );
  }

  if (isInstagram) {
    // Instagram post rendering logic here
    const instagramMedia = mention?.layout_content?.medias || [];
    const media = instagramMedia[0]?.media || {};  // Assuming we're rendering the first media in the array
    const caption = media?.caption?.text || "No caption available";
    const instagramUser = media?.user || {};
    const instagramUserName = instagramUser?.username || "Unknown User";
    const instagramUserFullName = instagramUser?.full_name || "No name available";
    // const instagramUserProfilePic = instagramUser?.profile_pic_url || "default-image-url.jpg";
    const instagramLikes = media?.like_count || 0;

    // Convert timestamp to readable date
    const instagramCreatedAt = new Date(media?.taken_at * 1000).toLocaleString();

    return (
      <div className="mention-card">
        <div className="mention-card-header">
          {/* <img src={instagramUserProfilePic} alt={`${instagramUserName}'s profile`} className="profile-image" /> */}
          <div className="user-info">
            <h3 className="user-name">{instagramUserName}</h3>
            <p className="user-full-name">{instagramUserFullName}</p>
          </div>
        </div>
        <div className="mention-card-body">
          <p className="instagram-caption">{caption}</p>
        </div>
        <div className="mention-card-footer">
          <span className="created-at">{instagramCreatedAt}</span>
          <span className="like-count">Likes: {instagramLikes}</span>
          <span className="platform-name">Source:Instagram</span>
        </div>
      </div>
    );
  }

  if (isFacebook) {
    // Facebook post rendering logic here
    const author = mention?.author || {};
    const authorName = author?.name || "Unknown User";
    const authorProfilePic = author?.profile_picture_url || "default-image-url.jpg";
    const message = mention?.message || "No message available";
    const facebookPostUrl = mention?.url || "#";
    const image = mention?.image?.uri || "default-image-url.jpg"; // Handle image URL
    const reactionsCount = mention?.reactions_count || 0;

    // Convert timestamp to readable date for Facebook post
    const facebookCreatedAt = new Date(mention?.timestamp * 1000).toLocaleString();

    return (
      <div className="mention-card">
        <div className="mention-card-header">
          <img src={authorProfilePic} alt={`${authorName}'s profile`} className="profile-image" />
          <div className="user-info">
            <h3 className="user-name">{authorName}</h3>
          </div>
        </div>
        <div className="mention-card-body">
          <p className="facebook-message">{message}</p>
          <a href={facebookPostUrl} target="_blank" rel="noopener noreferrer">View on Facebook</a>
          {/* {image && <img src={image} alt="Facebook post image" className="post-image" />} */}
        </div>
        <div className="mention-card-footer">
          <span className="created-at">{facebookCreatedAt}</span>
          <span className="reaction-count">Reactions: {reactionsCount}</span>
          <span className="platform-name">Source:Meta</span>
        </div>
      </div>
    );
  }

  return null; // If no matching type
};

export default MentionCard;
