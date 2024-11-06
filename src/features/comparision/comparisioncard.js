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
            <th></th>
            <th>{hashtag1}</th>
            <th>{hashtag2}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Mentions</td>
            <td>{hashtag1Count}</td>
            <td>{hashtag2Count}</td>
          </tr>
          <tr>
            <td>Instagram Mentions</td>
            <td>{hashtag1Count}</td>
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
