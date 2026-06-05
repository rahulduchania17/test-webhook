// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = "VERIFY_TOKEN";
// Route for GET requests
app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/webhook', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

app.get('/send', async (req, res) => {
  try {

    const response = await fetch(
      `https://graph.facebook.com/v23.0/${process.env.1080791958459902}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VERIFY_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: '919694610144',
          type: 'text',
          text: {
            body: 'Hello from Render!'
          }
        })
      }
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

// Start the server

app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
