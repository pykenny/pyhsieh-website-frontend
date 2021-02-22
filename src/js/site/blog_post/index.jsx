import React from 'react';
import ReactDOM from 'react-dom';
import 'lazysizes';
import htmlReactParser from 'html-react-parser';

import setIcons from '../../utils/icons';
import LocalizedTimestamp from '../../common/LocalizedTimestamp';
import SlideBussinessCard from '../../common/SlideBussinessCard';
import CodeSnippet from '../../common/CodeSnippet';

setIcons();

[...document.getElementsByClassName('timestamp')].forEach((elem) => {
  const timestamp = elem.getAttribute('timestamp');
  ReactDOM.render(<LocalizedTimestamp {...{ timestamp }} />, elem);
});

[...document.getElementsByTagName('pre')].forEach((elem) => {
  const filename = elem.getAttribute('file-name');
  // const language = elem.getAttribute('language');
  const codeData = elem.outerHTML;
  const data = elem.getElementsByTagName('code')[0].textContent;
  const snippetElem = document.createElement('div');
  elem.parentNode.replaceChild(snippetElem, elem);
  ReactDOM.render(
    <CodeSnippet {...{ filename, data }}>
      {htmlReactParser(codeData)}
    </CodeSnippet>,
    snippetElem,
  );
});

// Render process will destroy target element's children, so we
// clone the text content and turn it into an React element.
const bannerTarget = document.getElementById('blog-banner-bussiness-card');
const bannerElement = htmlReactParser(bannerTarget.innerHTML);

ReactDOM.render(
  <SlideBussinessCard>{bannerElement}</SlideBussinessCard>,
  bannerTarget,
);
