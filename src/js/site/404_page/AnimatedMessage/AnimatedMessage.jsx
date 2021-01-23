import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { sha1 } from 'hash.js';

const PARAGRAPH_KEY_PREFIX = 'site-404-content-paragraph';

class AnimatedMessage extends React.Component {
  constructor(props) {
    super(props);
    this.elementRef = createRef();
  }

  componentDidMount() {
    gsap
      .timeline({ delay: 1.25 })
      .fromTo(
        this.elementRef.current,
        { x: -16, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.25 },
      );
  }

  render() {
    const { message: rawMessage } = this.props;
    const messages = rawMessage.split('\n').map((paragraph) => {
      const hash = sha1().update(paragraph).digest('hex');
      return (
        <div
          className="site-404-content-paragraph"
          key={`${PARAGRAPH_KEY_PREFIX}-${hash}`}
        >
          {paragraph}
        </div>
      );
    });

    return (
      <div className="site-404-content-message" ref={this.elementRef}>
        {messages}
      </div>
    );
  }
}

AnimatedMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default AnimatedMessage;
