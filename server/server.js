import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(bodyParser.json());

// Route to handle the redirection after the user clicks "Sign in with X"
app.post('/x/get-redirect-url', async (_req, res) => {
  try {
    const finalRedirectUrl = `${IS_PROD ? 'https://valet.kinode.net' : 'http://localhost:5173'}/process-token?token=`;
    const response = await axios.post('https://api.staging.kinode.net/x/get-redirect-url', {
      finalRedirectUrl
    });
    const { url } = response.data;
    res.send(url);
  } catch (error) {
    console.error('Error fetching redirect URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to retrieve user details using the JWT
app.get('/get-user-info-x', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send('Authorization header is required');
  }
  try {
    const response = await axios.get('https://api.staging.kinode.net/get-user-info-x', {
      headers: {
        Authorization: authHeader
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to retrieve user kinodes
app.get('/get-user-kinodes', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send('Authorization header is required');
  }
  try {
    const response = await axios.get('https://api.staging.kinode.net/get-user-kinodes', {
      headers: {
        Authorization: authHeader
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user kinodes:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
