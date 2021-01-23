import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { gsap, Linear, Power3 } from 'gsap';
import { RoughEase } from 'gsap/EasePack';

gsap.registerPlugin(RoughEase);

class AnimatedTitle extends React.Component {
  constructor(props) {
    super(props);
    this.elementRef = createRef();
  }

  componentDidMount() {
    gsap
      .timeline()
      .fromTo(
        this.elementRef.current,
        { x: -6 },
        {
          x: 6,
          ease: RoughEase.ease.config({
            strength: 8,
            points: 25,
            template: Linear.easeNone,
            randomize: false,
          }),
          duration: 0.75,
        },
      )
      .to(this.elementRef.current, {
        x: 0,
        ease: Power3.easeOut,
        duration: 0.75,
      });
  }

  render() {
    const { title } = this.props;
    return (
      <div className="site-404-content-title" ref={this.elementRef}>
        {title}
      </div>
    );
  }
}

AnimatedTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AnimatedTitle;
