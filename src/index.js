import express from 'express';
import bodyParser from 'body-parser';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 8080;

// Determine the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (e.g., the generated QR code image)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to display the form
app.get('/', (req, res) => {
  res.send(`
    <form action="/generate" method="post">
      <label for="url">Enter your URL:</label>
      <input type="text" id="url" name="url" required>
      <button type="submit">Generate QR Code</button>
    </form>
  `);
});

// Route to handle form submission and generate QR code
app.post('/generate', (req, res) => {
  const url = req.body.url;
  const qr_svg = qr.image(url, { type: 'png' });
  const filePath = path.join(__dirname, 'public', 'qr_image.png');

  qr_svg.pipe(fs.createWriteStream(filePath)).on('finish', () => {
    res.send(`
      <h1>QR Code</h1>
      <img src="/qr_image.png" alt="QR Code">
      <a href="/">Generate another QR Code</a>
    `);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
