// services/googleDrive.js
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Paths
const TOKEN_PATH = path.join(__dirname, '../tokens.json');
const CREDENTIALS_PATH = path.join(__dirname, '../client_secret.json');

const DB_NAME = 'broklin.sqlite'; // The name of the file in Drive

// Load Credentials
const keys = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const key = keys.installed || keys.web;

// Setup Auth
const auth = new google.auth.OAuth2(
  key.client_id,
  key.client_secret,
  'http://localhost:3000/oauth2callback'
);

// Load Tokens
if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  auth.setCredentials(tokens);
} else {
  console.error("❌ No tokens found. Run auth_setup.js first.");
}

const drive = google.drive({ version: 'v3', auth });

/**
 * 1. Find the Database ID in Drive
 * We search for the file by name to see if it exists.
 */
async function getFileId() {
  try {
    const res = await drive.files.list({
      q: `name='${DB_NAME}' and trashed=false`,
      fields: 'files(id, name)',
    });
    if (res.data.files.length > 0) {
      return res.data.files[0].id;
    }
    return null; // File doesn't exist yet
  } catch (err) {
    console.error('Error searching Drive:', err);
    return null;
  }
}

/**
 * 2. Upload (Sync to Cloud)
 * Updates the file if it exists, creates it if it doesn't.
 */
async function uploadDatabase(localPath) {
  const fileId = await getFileId();
  const media = {
    mimeType: 'application/x-sqlite3',
    body: fs.createReadStream(localPath),
  };

  if (fileId) {
    // Update existing file
    console.log('☁️  Syncing update to Drive...');
    await drive.files.update({
      fileId: fileId,
      media: media,
    });
  } else {
    // Create new file
    console.log('☁️  Creating new DB in Drive...');
    await drive.files.create({
      resource: { name: DB_NAME },
      media: media,
    });
  }
  console.log('✅ Sync Complete.');
}

/**
 * 3. Download (Restore from Cloud)
 * Used when you start the app to get the latest data.
 */
async function downloadDatabase(destPath) {
  const fileId = await getFileId();
  if (!fileId) {
    console.log('ℹ️  No remote database found. Starting fresh locally.');
    return false;
  }

  console.log('⬇️  Downloading database from Drive...');
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.get(
    { fileId: fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return new Promise((resolve, reject) => {
    res.data
      .on('end', () => {
        console.log('✅ Download Complete.');
        resolve(true);
      })
      .on('error', (err) => {
        console.error('Error downloading:', err);
        reject(err);
      })
      .pipe(dest);
  });
}

module.exports = { uploadDatabase, downloadDatabase };