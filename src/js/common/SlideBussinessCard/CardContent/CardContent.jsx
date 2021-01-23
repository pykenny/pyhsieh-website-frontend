import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { gsap, TweenLite } from 'gsap';

class CardContent extends React.Component {
  constructor(props) {
    super(props);
    this.elementRef = createRef();
    this.timeline = gsap.timeline();
    this.currentTween = undefined;
  }

  componentDidMount() {
    // Shrink height to 0 behind the scene to let GSAP memoize height.
    // Also, it
    // (Could break on initial open if user switch media before opening)
    TweenLite.set(this.elementRef.current, { height: 0, position: 'static' });
  }

  componentDidUpdate() {
    const { opened } = this.props;
    const toSettings = {
      height: opened ? 'auto' : 0,
      ease: opened ? 'back.out' : 'back.in',
      duration: 0.75,
    };

    // To prevent unexpected 'flashing' behavior, manually cancel current
    // animation and twitch easing curve a bit.
    if (this.timeline.isActive()) {
      this.timeline.remove(this.currentTween);
      toSettings.ease = opened ? 'back.inOut' : 'back.in';
    }

    this.currentTween = TweenLite.to(this.elementRef.current, toSettings);
    this.timeline.add(this.currentTween);
  }

  render() {
    const { children } = this.props;
    return (
      <div className="blog-banner-bussiness-card-intro" ref={this.elementRef}>
        {children}
      </div>
    );
  }
}

CardContent.propTypes = {
  opened: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default CardContent;
