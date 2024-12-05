import React from 'react';
import PropTypes from 'prop-types';
import './comparisioncard.css';

const ComparisonCard = ({ hashtag1, hashtag2, hashtag1Count, hashtag2Count, hashtag3Count, hashtag4Count, hashtag5Count, hashtag6Count }) => {
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
            <td>{hashtag5Count}</td>
            <td>{hashtag6Count}</td>
          </tr>
          <tr>
            <td>Twitter Mentions</td>
            <td>{hashtag3Count}</td>
            <td>{hashtag4Count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ComparisonCard.propTypes = {
  hashtag1Count: PropTypes.number.isRequired,
  hashtag2Count: PropTypes.number.isRequired,
  hashtag3Count: PropTypes.number.isRequired,
  hashtag4Count: PropTypes.number.isRequired,
  hashtag5Count: PropTypes.number.isRequired,
  hashtag6Count: PropTypes.number.isRequired,
  hashtag1: PropTypes.string.isRequired,
  hashtag2: PropTypes.string.isRequired,
};

export default ComparisonCard;
  
  
  
  // import React from 'react';
  // import PropTypes from 'prop-types';
  // import './comparisioncard.css';

  // const ComparisonCard = ({ hashtag1Count, hashtag2Count, hashtag1, hashtag2, hashtag3Count, hashtag4Count }) => {
  //   return (
  //     <div className="comparison-card">
  //       <h3>Overview</h3>
  //       <table>
  //         <thead>
  //           <tr>
  //             <th></th>
  //             <th>{hashtag1}</th>
  //             <th>{hashtag2}</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           <tr>
  //             <td>Total Mentions</td>
  //             <td>{hashtag1Count + hashtag3Count}</td>
  //             <td>{hashtag2Count + hashtag4Count}</td>
  //           </tr>
  //           <tr>
  //             <td>Instagram Mentions</td>
  //             <td>{hashtag1Count}</td>
  //             <td>{hashtag2Count}</td>
  //           </tr>
  //           <tr>
  //             <td>Twitter Mentions</td>
  //             <td>{hashtag3Count}</td>
  //             <td>{hashtag4Count}</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };

  // ComparisonCard.propTypes = {
  //   hashtag1Count: PropTypes.number.isRequired,
  //   hashtag2Count: PropTypes.number.isRequired,
  //   hashtag3Count: PropTypes.number.isRequired,
  //   hashtag4Count: PropTypes.number.isRequired,
  //   hashtag1: PropTypes.string.isRequired,
  //   hashtag2: PropTypes.string.isRequired,
  // };

  // export default ComparisonCard;
