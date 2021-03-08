import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, CheckSquare } from 'react-feather';

const COPY_HINT = 'Copy';
const COPYING_HINT = 'Copied!';

function CopyButton(props) {
  const { data, copying, onCopy } = props;
  const IconClass = copying ? CheckSquare : Copy;
  return (
    <CopyToClipboard text={data} onCopy={onCopy}>
      <div
        className={`snippet-copy-btn${copying ? ' copying' : ''}`}
        title={copying ? COPYING_HINT : COPY_HINT}
      >
        <IconClass width={18} height={18} />
      </div>
    </CopyToClipboard>
  );
}

CopyButton.propTypes = {
  data: PropTypes.string.isRequired,
  copying: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default CopyButton;
