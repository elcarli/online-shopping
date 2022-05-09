const createApp = require('./app');
require('dotenv').config();

const app = createApp();

app.listen(process.env.PORT || 3000, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
});