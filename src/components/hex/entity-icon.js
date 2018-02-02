import React from 'react';
import PropTypes from 'prop-types';

import Entities from 'constants/entities';

export default function EntityIcon({ xOffset, yOffset, width, entityType }) {
  if (entityType === Entities.asteroidBelt.key) {
    return (
      <g>
        <circle
          className="Hex-System"
          cx={xOffset - width / 12}
          cy={yOffset - width / 15}
          r={width / 20}
        />
        <circle
          className="Hex-System"
          cx={xOffset - width / 4}
          cy={yOffset - width / 25}
          r={width / 30}
        />
        <circle
          className="Hex-System"
          cx={xOffset - width / 8}
          cy={yOffset + width / 40}
          r={width / 40}
        />
        <circle
          className="Hex-System"
          cx={xOffset + width / 8}
          cy={yOffset + width / 25}
          r={width / 16}
        />
        <circle
          className="Hex-System"
          cx={xOffset + width / 5}
          cy={yOffset - width / 15}
          r={width / 40}
        />
        <circle
          className="Hex-System"
          cx={xOffset}
          cy={yOffset}
          r={width / 45}
        />
        <circle
          className="Hex-System"
          cx={xOffset + width / 12}
          cy={yOffset - width / 10}
          r={width / 30}
        />
        <circle
          className="Hex-System"
          cx={xOffset + width / 3.6}
          cy={yOffset + width / 25}
          r={width / 50}
        />
      </g>
    );
  }
  if (entityType === Entities.deepSpaceStation.key) {
    const wingWidth = width / 40;
    return (
      <g>
        <rect
          className="Hex-System"
          x={xOffset - width / 5 - wingWidth / 2}
          y={yOffset - width / 25}
          width={width / 15}
          height={width / 12}
        />
        <rect
          className="Hex-System"
          x={xOffset - width / 10 - wingWidth / 2}
          y={yOffset - width / 25}
          width={width / 15}
          height={width / 12}
        />
        <rect
          className="Hex-System"
          x={xOffset}
          y={yOffset - width / 12}
          width={width / 22}
          height={width / 6}
        />
        <rect
          className="Hex-System"
          x={xOffset + width / 10 - wingWidth / 2}
          y={yOffset - width / 25}
          width={width / 15}
          height={width / 12}
        />
        <rect
          className="Hex-System"
          x={xOffset + width / 5 - wingWidth / 2}
          y={yOffset - width / 25}
          width={width / 15}
          height={width / 12}
        />
      </g>
    );
  }
  return (
    <circle
      className={
        entityType === Entities.blackHole.key ? 'Hex-BlackHole' : 'Hex-System'
      }
      cx={xOffset}
      cy={yOffset}
      r={width / 13}
    />
  );
}

EntityIcon.propTypes = {
  xOffset: PropTypes.number.isRequired,
  yOffset: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  entityType: PropTypes.string.isRequired,
};