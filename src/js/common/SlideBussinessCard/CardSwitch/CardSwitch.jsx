import React from 'react';
import PropTypes from 'prop-types';
import { PlusSquare, MinusSquare } from 'react-feather';

function CardSwitch(props) {
  const { onClick, opened } = props;

  const focusedCarriageReturnHandler = (evt) => {
    if (evt.key === 'Enter') {
      onClick();
    }
  };

  const Icon = opened ? MinusSquare : PlusSquare;

  return (
    <div
      className="blog-banner-bussiness-card-switch"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={focusedCarriageReturnHandler}
    >
      <Icon size={32} />
    </div>
  );
}

CardSwitch.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CardSwitch;
