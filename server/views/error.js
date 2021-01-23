const Path = require('path');

function NotFoundResponse(req, res) {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(Path.join(__dirname, '../../dist/404_page/index.html'));
  } else if (req.accepts('json')) {
    res.send({ msg: 'Not a valid request' });
  } else {
    res.type('txt').send('Requested resource not found');
  }
}

module.exports = {
  NotFoundResponse,
};
