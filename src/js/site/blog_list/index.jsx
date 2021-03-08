import React from 'react';
import ReactDOM from 'react-dom';
import 'lazysizes';
import htmlReactParser from 'html-react-parser';

import setIcons from '../../utils/icons';
import LocalizedTimestamp from '../../common/LocalizedTimestamp';
import SlideBussinessCard from '../../common/SlideBussinessCard';

setIcons();

[...document.getElementsByClassName('timestamp')].forEach((elem) => {
  const timestamp = elem.getAttribute('timestamp');
  ReactDOM.render(<LocalizedTimestamp {...{ timestamp }} />, elem);
});

// Render process will destroy target element's children, so we
// clone the text content and turn it into an React element.
const bannerTarget = document.getElementById('blog-banner-bussiness-card');
const bannerElement = htmlReactParser(bannerTarget.innerHTML);

ReactDOM.render(
  <SlideBussinessCard>{bannerElement}</SlideBussinessCard>,
  bannerTarget,
);
