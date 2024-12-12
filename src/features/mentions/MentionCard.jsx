import React from 'react';
import '../../styles/MentionCard.css'; // Ensure your CSS is imported
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

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
  className="mention-card-user-image w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-md"
/>
<h3 className="mention-card-username text-lg font-semibold text-gray-800">
      {mention.username || 'Unknown User'}
    </h3>
    </div>

    {/* Card Body */}
    <div className="mention-card-body">
    <p className="mention-card-text text-sm text-gray-700">
      {mention.text || 'No mention text available'}
    </p>
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
    <span
      className="mention-card-timestamp text-sm text-gray-500 italic"
    >
      {mention.timestamp || 'No timestamp available'}
    </span>

      {/* Dynamic Tag */}
      <span
  className={`mention-card-tag px-4 py-2 text-sm font-bold uppercase rounded-full shadow-md tracking-wide ${
    isFilteredText === 'Positive'
      ? 'bg-green-600 text-white border border-green-800'
      : isFilteredText === 'Negative'
      ? 'bg-red-600 text-white border border-red-800'
      : 'bg-yellow-500 text-white border border-yellow-700'
  }`}
>
  {isFilteredText}
</span>

      

<span className="mention-card-platform inline-flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full shadow-md">
  {platformName === 'Twitter' && (
    <>
      <FaTwitter className="text-blue-500 w-4 h-4" />
      <span className="text-blue-500">Twitter</span>
    </>
  )}
  {platformName === 'Instagram' && (
    <>
      <FaInstagram className="text-pink-500 w-4 h-4" />
      <span className="text-pink-500">Instagram</span>
    </>
  )}
  {platformName === 'LinkedIn' && (
    <>
      <FaLinkedin className="text-blue-700 w-4 h-4" />
      <span className="text-blue-700">LinkedIn</span>
    </>
  )}
</span>

    </div>
  </div>
);

};

export default MentionCard;