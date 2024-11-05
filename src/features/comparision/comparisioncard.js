import React from 'react';
import PropTypes from 'prop-types';
import './comparisioncard.css';

const ComparisonCard = ({ hashtag1Count, hashtag2Count, hashtag1, hashtag2 }) => {
  return (
    <div className="comparison-card">
      <h3>Overview</h3>
      <table>
        <thead>
          <tr>
            <th>Brand Name</th>
            <th>Total Instagram Mentions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#{hashtag1}</td>
            <td>{hashtag1Count}</td>
          </tr>
          <tr>
            <td>#{hashtag2}</td>
            <td>{hashtag2Count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ComparisonCard.propTypes = {
  hashtag1Count: PropTypes.number.isRequired,
  hashtag2Count: PropTypes.number.isRequired,
  hashtag1: PropTypes.string.isRequired,
  hashtag2: PropTypes.string.isRequired,
};

export default ComparisonCard;
