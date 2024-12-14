import React from "react";
import "../../styles/MentionCard.css"; // Ensure your CSS is imported
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const MentionCard = ({ mention }) => {
  if (!mention) {
    return <div className="mention-card">No mention data available</div>;
  }

  const platformName = mention.source;

  const isFilteredText =
    mention.Sentiment === "positive"
      ? "Positive"
      : mention.Sentiment === "negative"
        ? "Negative"
        : "Neutral";

  const isFilteredClass =
    mention.Sentiment === "positive"
      ? "text-green-700 bg-green-100 border-green-700"
      : mention.Sentiment === "negative"
        ? "text-red-700 bg-red-100 border-red-700"
        : "text-yellow-700 bg-yellow-100 border-yellow-700";

  const userImage = mention.profile_image_url || "./profile image.jpg";

  return (
    <div className="mention-card bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-4">
      {/* Card Header */}
      <div className="flex items-center mb-4">
        <img
          src={userImage}
          alt={`${mention.username || "Unknown User"}'s profile`}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 shadow-sm mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {mention.username || "Unknown User"}
          </h3>
          <span className="text-sm text-gray-500 italic">
            {mention.timestamp
              ? mention.timestamp.split(" ").slice(0, 3).join(" ") // Shows "Fri Dec 13"
              : "No timestamp available"}
          </span>
        </div>

      </div>

      {/* Card Body */}
      <div className="mb-4">
        <p
          className="text-black bg-white text-left font-[Segoe UI] text-[14px] font-normal leading-[18.62px]"
          style={{
            textUnderlinePosition: "from-font",
            textDecorationSkipInk: "none",
          }}
        >
          {mention.text || "No mention text available"}
        </p>


        {mention.hashtags && mention.hashtags.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {mention.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-[#0A66C2] text-[12px] font-semibold leading-[15.96px]  mr-2 rounded"
                style={{
                  fontFamily: "Segoe UI",
                  textAlign: "left",
                  textUnderlinePosition: "from-font",
                  textDecorationSkipInk: "none",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>


        )}
      </div>

      {/* Mention Image */}
      {/* {mention.images && mention.images.length > 0 && (
        <div className="mention-card-image mb-4">
          <img
            src={mention.images[0]} // Assuming the first image
            alt="Mention"
            className="w-full rounded-lg"
          />
        </div>
      )} */}

      {/* Card Footer */}
      <div className="flex items-center justify-between">
  {/* Left Section: Sentiment Tag and Timestamp */}
  <div className="flex items-center space-x-2">
    {/* Sentiment Tag */}
    <span
      className={`px-4 py-1 text-sm font-[Segoe UI] border shadow-sm ${isFilteredClass}`}
    >
      {isFilteredText}
    </span>
    <span className="text-sm text-gray-500 italic">
      {mention.timestamp
        ? mention.timestamp.split(" ").slice(3).join(" ") // Shows "03:09:37 +0000 2024"
        : ""}
    </span>
  </div>

  {/* Right Section: Platform Tag */}
  <div>
    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700">
      {platformName === "Twitter" && (
        <>
          <FaTwitter className="text-blue-500 w-4 h-4 mr-2" />
          Twitter
        </>
      )}
      {platformName === "Instagram" && (
        <>
          <FaInstagram className="text-pink-500 w-4 h-4 mr-2" />
          Instagram
        </>
      )}
      {platformName === "LinkedIn" && (
        <>
          <FaLinkedin className="text-blue-700 w-4 h-4 mr-2" />
          LinkedIn
        </>
      )}
    </span>
  </div>
</div>

    </div>
  );
};

export default MentionCard;
