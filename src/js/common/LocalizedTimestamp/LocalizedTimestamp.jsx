import React from 'react';
import PropTypes from 'prop-types';

import convertTimestamp from '../../utils/time';

function LocalizedTimestamp(props) {
  const { timestamp } = props;
  return <div className="timestamp">{convertTimestamp(timestamp)}</div>;
}

LocalizedTimestamp.propTypes = {
  timestamp: PropTypes.string.isRequired,
};

export default LocalizedTimestamp;
