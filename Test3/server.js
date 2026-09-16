const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const publicDirectory = path.join(__dirname, 'public');

app.use(express.static(publicDirectory));

app.get('/health', (request, response) => {
  response.json({ status: 'ok', service: 'portfolio' });
});

app.use((request, response) => {
  response.status(404).sendFile(path.join(publicDirectory, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server is running at http://localhost:${PORT}`);
});

module.exports = app;
