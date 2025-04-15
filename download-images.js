import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logo URLs from the original carousel
const logos = [
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flair_Logo.png/320px-Flair_Logo.png', 
    filename: 'flair-logo.png' 
  },
  { 
    url: 'https://fulfillment.io/wp-content/uploads/2022/11/fulfillment-logo.png', 
    filename: 'fulfillment-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Tabby_logo.svg/320px-Tabby_logo.svg.png', 
    filename: 'tabby-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Tamara_logo.svg/320px-Tamara_logo.svg.png', 
    filename: 'tamara-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Salasa-Logo.png/320px-Salasa-Logo.png', 
    filename: 'salasa-logo.png' 
  },
  { 
    url: 'https://www.moneyhash.io/assets/logo.png', 
    filename: 'moneyhash-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Ministry_of_Investment_Logo.svg/320px-Ministry_of_Investment_Logo.svg.png', 
    filename: 'ministry-logo.png' 
  },
  { 
    url: 'https://www.antler.co/static/05bd2c0b48ba74fb32b985e39ccfceea/antler-logo.svg', 
    filename: 'antler-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/320px-OpenAI_Logo.svg.png', 
    filename: 'openai-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Gemini_logo.svg/320px-Gemini_logo.svg.png', 
    filename: 'gemini-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/320px-American_Express_logo_%282018%29.svg.png', 
    filename: 'amex-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/320px-Mastercard-logo.svg.png', 
    filename: 'mastercard-logo.png' 
  },
  { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/DP_World_logo.svg/320px-DP_World_logo.svg.png', 
    filename: 'dpworld-logo.png' 
  }
];

// Make sure the images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${filePath}`);
    
    // Choose http or https based on the URL
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Following redirect to: ${response.headers.location}`);
        downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Check if the response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      // Create a write stream to save the file
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Download all logos
async function downloadAllLogos() {
  for (const logo of logos) {
    const filePath = path.join(imagesDir, logo.filename);
    try {
      await downloadFile(logo.url, filePath);
    } catch (error) {
      console.error(`Error downloading ${logo.url}: ${error.message}`);
    }
  }
  console.log('All downloads completed!');
}

downloadAllLogos(); 