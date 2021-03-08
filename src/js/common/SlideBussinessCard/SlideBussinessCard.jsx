import React from 'react';
import PropTypes from 'prop-types';

import CardSwitch from './CardSwitch';
import CardContent from './CardContent';

class SlideBussinessCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
    this.onOpenedToggled = this.onOpenedToggled.bind(this);
  }

  onOpenedToggled() {
    this.setState(({ opened }) => ({ opened: !opened }));
  }

  render() {
    const { children } = this.props;
    const { opened } = this.state;
    return (
      <>
        <CardSwitch opened={opened} onClick={this.onOpenedToggled} />
        <CardContent opened={opened}>{children}</CardContent>
      </>
    );
  }
}

SlideBussinessCard.propTypes = {
  children: PropTypes.element.isRequired,
};

export default SlideBussinessCard;
