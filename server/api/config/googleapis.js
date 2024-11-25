const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");

// Path to your credentials.json
const CREDENTIALS_PATH = "credentials.json";
const TOKEN_PATH = "token.json";

// Scopes for Gmail API
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// Load credentials and start authorization flow
function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if token already exists
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    listEmails(oAuth2Client); // Proceed to Gmail API usage
  } else {
    getNewToken(oAuth2Client);
  }
}

// Generate new token
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this URL:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);

      // Save token for future use
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log("Token stored to", TOKEN_PATH);

      listEmails(oAuth2Client);
    });
  });
}

// Example Gmail API call: List emails
function listEmails(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages.list(
    { userId: "me", q: "from:notifications@zellepay.com" },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const messages = res.data.messages;
      if (!messages || messages.length === 0) {
        console.log("No messages found.");
      } else {
        console.log("Messages:");
        messages.forEach((message) => {
          console.log(`- ${message.id}`);
        });
      }
    }
  );
}

authorize();
