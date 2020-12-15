import React from 'react';
import ReactDOM from 'react-dom';
import 'lazysizes';

import LocalizedTimestamp from '../../common/LocalizedTimestamp';

[...document.getElementsByClassName('timestamp')].forEach((elem) => {
  const timestamp = elem.getAttribute('timestamp');
  ReactDOM.render(<LocalizedTimestamp {...{ timestamp }} />, elem);
});
