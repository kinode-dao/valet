import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors({
  allowedHeaders: ['Authorization', 'Content-Type'], // Add other headers here as needed
  origin: IS_PROD ? 'https://valet.kinode.net' : '*', // Adjust this according to your security requirements
}));
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

// redirect all other requests to api.staging.kinode.net
app.all('*', async (req, res) => {
  const { method, path, body, query, headers: h } = req;
  const apiUrl = `https://api.staging.kinode.net${path}`;
  const headers = { ...h, host: new URL(apiUrl).host }
  try {
    const response = await axios({
      method,
      url: apiUrl,
      data: body,
      params: query,
      headers,
    });

    console.log({ response })
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(error.response ? error.response.status : 500).send(error.response ? error.response.data : 'Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
