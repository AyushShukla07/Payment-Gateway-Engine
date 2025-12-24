import express from 'express';
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  console.log('Signature:', req.headers['x-signature']);
  res.sendStatus(200);
});

app.listen(9000, () => {
  console.log('Webhook receiver running on port 9000');
});
