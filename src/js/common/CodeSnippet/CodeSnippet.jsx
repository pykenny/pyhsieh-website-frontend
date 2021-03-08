/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import CopyButton from './CopyButton';

const COPIED_NOTICE_PERIOD_MS = 750;

class CodeSnippet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copying: false,
      timerId: undefined,
    };
    this.onCopy = this.onCopy.bind(this);
  }

  onCopy() {
    const { timerId } = this.state;
    if (timerId !== undefined) {
      clearInterval(timerId);
    }
    this.setState({
      copying: true,
      timerId: setTimeout(() => {
        this.setState({ copying: false, timerId: undefined });
      }, COPIED_NOTICE_PERIOD_MS),
    });
  }

  render() {
    const {
      language, filename, data, children,
    } = this.props;
    const { copying } = this.state;
    return (
      <div className="code-snippet">
        <div className="snippet-toolbar-container">
          <div className="snippet-toolbar">
            {language && <div className="snippet-language">{language}</div>}
            {filename && <div className="snippet-filename">{filename}</div>}
            <CopyButton data={data} onCopy={this.onCopy} copying={copying} />
          </div>
        </div>
        {children}
      </div>
    );
  }
}

CodeSnippet.propTypes = {
  data: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  filename: PropTypes.string,
  language: PropTypes.string,
};

CodeSnippet.defaultProps = {
  filename: undefined,
  language: undefined,
};

export default CodeSnippet;
