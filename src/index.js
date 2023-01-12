require('dotenv').config();
const server = require('./server');

const port =
  process.env.ENV_MODE === 'production' ? process.env.SV_PORT || 80 : 3001;

server.listen(port, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:${port}`);
});