import React, { useState, useEffect } from 'react';
import MentionsChart from './MentionsChart';
import MentionCard from './MentionCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';
import '../../styles/MentionsPage.css';

const MentionsPage = () => {
  const [mentions, setMentions] = useState([]); // State for Twitter mentions
  const [instagramPosts, setInstagramPosts] = useState([]); // State for Instagram posts
  const [facebookPosts, setFacebookPosts] = useState([]); // State for Facebook posts
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [twitterCursor, setTwitterCursor] = useState(null); // State for Twitter pagination
  const [instagramCursor, setInstagramCursor] = useState(''); // State for Instagram pagination
  const [facebookCursor, setFacebookCursor] = useState(null); // State for Facebook pagination
  const { brand } = useBrand();

  // Function to fetch Twitter mentions
  const fetchMentions = async (query, nextCursor) => {
    try {
      const url = 'https://twitter-pack.p.rapidapi.com/search/tweet';
      const options = {
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'twitter-pack.p.rapidapi.com'
        },
        params: {
          query: `brand=${query || brand} clothing`,
          cursor: nextCursor,
          count: 1000
        }
      };

      const response = await axios.get(url, options);
      console.log("Twitter API response:", response.data);

      const mentionsData = response.data?.data?.data || [];
      const nextCursorResponse = response.data?.data?.cursor;
      setMentions(prevMentions => [...prevMentions, ...mentionsData]);
      setTwitterCursor(nextCursorResponse);
    } catch (error) {
      console.error('Error fetching Twitter mentions:', error);
    }
  };

  // Function to fetch Instagram posts
  const fetchInstagramPosts = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://instagram-best-experience.p.rapidapi.com/hashtag_section',
        params: {
          tag: searchTerm || brand,
          section: 'recent',
          rank_token: instagramCursor,
        },
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac',
          'x-rapidapi-host': 'instagram-best-experience.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      console.log("Instagram API response:", response.data);

      const instagramData = response.data?.data?.sections || [];
      const nextRankToken = response.data?.data?.rank_token || '';
      setInstagramPosts(prevPosts => [...prevPosts, ...instagramData]);
      setInstagramCursor(nextRankToken);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
    }
  };

  // Function to fetch Facebook posts
  const fetchFacebookPosts = async () => {
    try {
       
      const options = {
        method: 'GET',
        url: 'https://facebook-scraper3.p.rapidapi.com/search/posts',
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        },
        params: {
          query: `brand=${searchTerm || brand} clothing`,
          recent_posts: true,
          cursor: facebookCursor,
          count: 20
        }
      };

      const response = await axios.request(options);
      console.log("Facebook API response:", response.data);

      const facebookData = response.data?.results || [];
      const nextCursor = response.data?.cursor || null;
      setFacebookPosts(prevPosts => [...prevPosts, ...facebookData]);
      setFacebookCursor(nextCursor);
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
    }
  };

  // Fetch data when component mounts or search term changes
  useEffect(() => {
    fetchMentions(searchTerm || brand, twitterCursor); // Fetch Twitter mentions
    fetchInstagramPosts(); // Fetch Instagram posts
    fetchFacebookPosts(); // Fetch Facebook posts
  }, [brand, searchTerm]);

  // Handle search input from Header
  const handleSearch = (newSearchTerm) => {
    setTwitterCursor(null);
    setInstagramCursor('');
    setFacebookCursor(null);
    setSearchTerm(newSearchTerm);
    setMentions([]); // Clear previous mentions
    setInstagramPosts([]); // Clear previous Instagram posts
    setFacebookPosts([]); // Clear previous Facebook posts
  };

  // Load more functionality for all APIs
  const loadMoreData = (apiType) => {
    switch (apiType) {
      case 'twitter':
        if (twitterCursor) {
          fetchMentions(searchTerm || brand, twitterCursor);
        }
        break;
      case 'instagram':
        if (instagramCursor) {
          fetchInstagramPosts();
        }
        break;
      case 'facebook':
        if (facebookCursor) {
          fetchFacebookPosts();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="mentions-page">
      <Sidebar />
      <div className="mentions-content">
        <Header onSearch={handleSearch} />
        <MentionsChart mentions={mentions} />
        <div className="mentions-list">
          {/* Render Twitter Mentions */}
          {mentions.map((mention, index) => (
            <MentionCard key={index} mention={mention} isInstagram={false} isFacebook={false} />
          ))}

          {/* Render Instagram Posts */}
          {instagramPosts.map((post, index) => (
            <MentionCard key={index} mention={post} isInstagram={true} isFacebook={false} />
          ))}

          {/* Render Facebook Posts */}
          {facebookPosts.map((post, index) => (
            <MentionCard key={index} mention={post} isInstagram={false} isFacebook={true} />
          ))}
        </div>
        {/* Single Load More Button for all platforms */}
        {(twitterCursor || instagramCursor || facebookCursor) && (
          <button className="load-more-button" onClick={loadMoreData}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default MentionsPage;
