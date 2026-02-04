const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');
const open = require('open'); // Opens browser automatically
const destroyer = require('server-destroy'); // Clean shutdown

/**
 * CONFIGURATION
 */
const KEY_FILE = path.join(__dirname, 'client_secret.json');
const TOKEN_FILE = path.join(__dirname, 'tokens.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

/**
 * MAIN LOGIC
 */
async function main() {
  // 1. Read the credentials file you downloaded
  let keys;
  try {
    const content = fs.readFileSync(KEY_FILE);
    keys = JSON.parse(content);
  } catch (err) {
    console.error('Error: client_secret.json not found. Did you download it from Google Cloud?');
    return;
  }

  // 2. Create the OAuth2 Client
  // Google's JSON structure puts keys under 'web' or 'installed'
  const key = keys.installed || keys.web;
  const oauth2Client = new google.auth.OAuth2(
    key.client_id,
    key.client_secret,
    'http://localhost:3000/oauth2callback' // Must match Google Console exactly
  );

  // 3. Check if we already have tokens
  if (fs.existsSync(TOKEN_FILE)) {
    console.log('✅ tokens.json already exists! You are good to go.');
    return;
  }

  // 4. If no tokens, start a temporary server to handle the login
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url.indexOf('/oauth2callback') > -1) {
        // A. Get the code from the URL
        const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
        const code = qs.get('code');
        res.end('Authentication successful! You can close this tab.');
        server.destroy(); // Close server

        // B. Trade the code for real tokens
        const { tokens } = await oauth2Client.getToken(code);
        
        // C. Save tokens to file
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));
        console.log('✅ Tokens saved to tokens.json! Setup complete.');
      }
    } catch (e) {
      console.error(e);
      res.end('Error during authentication');
    }
  }).listen(3000);

  destroyer(server);

  // 5. Generate the Login URL and open it
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Gets a Refresh Token (Important for long-term access)
    scope: SCOPES,
  });

  console.log('Opening browser for authentication...');
  await open(authUrl);
}

main().catch(console.error);