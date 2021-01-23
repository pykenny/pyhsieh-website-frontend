import React from 'react';
import ReactDOM from 'react-dom';

import AnimatedTitle from './AnimatedTitle';
import AnimatedMessage from './AnimatedMessage';

const ERROR_TITLE_ELEMENT_ID = 'error-page-title-container';
const ERROR_TITLE_STR = 'Ooops!';
const ERROR_MESSAGE_ELEMENT_ID = 'error-page-content-container';
const ERROR_MESSAGE_STR = "I'm sorry that the requested page cannot be found.\n"
  + 'It might be caused by typos in URL or due to updates.\n'
  + 'You can click on the title ("Layperson\'s Notes") in the banner and redirect back to the top page.';

ReactDOM.render(
  <AnimatedTitle title={ERROR_TITLE_STR} />,
  document.getElementById(ERROR_TITLE_ELEMENT_ID),
);

ReactDOM.render(
  <AnimatedMessage message={ERROR_MESSAGE_STR} />,
  document.getElementById(ERROR_MESSAGE_ELEMENT_ID),
);
