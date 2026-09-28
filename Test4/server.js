const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DEFAULT_PORT = 3005;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const dataFilePath = path.join(__dirname, 'requests.json');
const VALID_CATEGORIES = ['Academic', 'Facilities', 'IT Support', 'Finance', 'Other'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
  }
}

function readRequests() {
  ensureDataFile();

  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error instanceof SyntaxError) {
      fs.writeFileSync(dataFilePath, '[]', 'utf8');
      return [];
    }
    throw error;
  }
}

function writeRequests(requests) {
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2), 'utf8');
}

function getSafeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateRequest(data) {
  if (!data || typeof data !== 'object') {
    return 'Request body is required';
  }

  const studentName = getSafeString(data.studentName);
  const email = getSafeString(data.email);
  const category = getSafeString(data.category);
  const problemDescription = getSafeString(data.problemDescription);
  const priority = getSafeString(data.priority);

  if (!studentName) return 'Student name is required';
  if (!email) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address';
  if (!category) return 'Category is required';
  if (!VALID_CATEGORIES.includes(category)) return 'Selected category is invalid';
  if (!problemDescription) return 'Problem description is required';
  if (!priority) return 'Priority is required';
  if (!VALID_PRIORITIES.includes(priority)) return 'Selected priority is invalid';

  return null;
}

function nextRequestId(requests) {
  const ids = requests.map((item) => Number(item.id) || 0);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (request, response) => {
  response.json({ status: 'ok', service: 'campus-help-desk' });
});

app.get('/api/requests', (request, response) => {
  const requests = readRequests();
  response.json(requests.sort((a, b) => Number(b.id) - Number(a.id)));
});

app.get('/api/requests/:id', (request, response) => {
  const requests = readRequests();
  const requestItem = requests.find((item) => Number(item.id) === Number(request.params.id));

  if (!requestItem) {
    return response.status(404).json({ message: 'Request not found' });
  }

  response.json(requestItem);
});

app.post('/api/requests', (request, response) => {
  const validationError = validateRequest(request.body);

  if (validationError) {
    return response.status(400).json({ message: validationError });
  }

  const requests = readRequests();
  const newRequest = {
    id: nextRequestId(requests),
    studentName: getSafeString(request.body.studentName),
    email: getSafeString(request.body.email),
    category: getSafeString(request.body.category),
    problemDescription: getSafeString(request.body.problemDescription),
    priority: getSafeString(request.body.priority)
  };

  requests.push(newRequest);
  writeRequests(requests);
  response.status(201).json(newRequest);
});

app.put('/api/requests/:id', (request, response) => {
  const requests = readRequests();
  const requestIndex = requests.findIndex((item) => Number(item.id) === Number(request.params.id));

  if (requestIndex === -1) {
    return response.status(404).json({ message: 'Request not found' });
  }

  const validationError = validateRequest(request.body);

  if (validationError) {
    return response.status(400).json({ message: validationError });
  }

  requests[requestIndex] = {
    ...requests[requestIndex],
    studentName: getSafeString(request.body.studentName),
    email: getSafeString(request.body.email),
    category: getSafeString(request.body.category),
    problemDescription: getSafeString(request.body.problemDescription),
    priority: getSafeString(request.body.priority)
  };

  writeRequests(requests);
  response.json(requests[requestIndex]);
});

app.delete('/api/requests/:id', (request, response) => {
  const requests = readRequests();
  const requestIndex = requests.findIndex((item) => Number(item.id) === Number(request.params.id));

  if (requestIndex === -1) {
    return response.status(404).json({ message: 'Request not found' });
  }

  const [deletedRequest] = requests.splice(requestIndex, 1);
  writeRequests(requests);
  response.json({ message: 'Request deleted', deletedRequest });
});

app.use((request, response) => {
  response.status(404).json({ message: 'Route not found' });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Campus Help Desk API running at http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      if (nextPort <= port + 10) {
        console.log(`Port ${port} is busy, trying ${nextPort}...`);
        startServer(nextPort);
        return;
      }

      console.error('No free port found in the range. Please stop another app or set PORT manually.');
      process.exit(1);
    }

    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
}

startServer(PORT);

module.exports = app;
