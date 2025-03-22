import React from 'react';

function BanList({ banList, removeFromBanList }) {
  return (
    <div className="ban-list">
      <h3>Ban List</h3>
      <ul>
        {banList.map((ban, index) => (
          <li key={index} listStyleType="none">
            {Object.keys(ban).map(key => (
              <span key={key}>
                {key}: {ban[key]}{' '}
                <button onClick={() => removeFromBanList(key, ban[key])}>Remove</button>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BanList;
