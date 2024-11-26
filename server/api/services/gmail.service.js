const { google } = require("googleapis");
const Receipt = require("../services/receipt.service");
const UserToken = require("../models/usertoken.model");
const { parseEmailContent } = require("../utils/parseEmailContent.util"); // Function to parse email details
const { throwError } = require("../utils/error.util");
const {
  containeranalysis,
} = require("googleapis/build/src/apis/containeranalysis");

console.log("From Gmail Service:", process.env.REDIRECT_URI);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Attach the tokens listener once
oauth2Client.on("tokens", async (tokens) => {
  console.log("Tokens received:", tokens);
  if (tokens.refresh_token) {
    await UserToken.updateOne(
      { email: process.env.CLIENT_EMAIL },
      {
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        expiryDate: tokens.expiry_date,
      }
    );
  }
});

// Define a function to list emails
async function checkForZelleEmails(auth) {
  console.log("Checking for Zelle emails");
  const receipts = await Receipt.getReceipts({}, { emailId: 1 });
  const emailIds = new Map(
    receipts.data?.map((receipt) => [receipt.emailId, true])
  );

  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    // q: "from:contactabdullahmehdi@gmail.com",
    // q: "from:alerts@notify.wellsfargo.com subject:'You received money with Zelle(R)'",
    // q: "from:a.sajjad72823@gmail.com subject:'You received money with Zelle(R)'",
    q: "subject:'You received money with Zelle(R)'",
  });

  const messages = res.data.messages || [];

  const counter = { new: 0, toDB: 0 };
  for (const message of messages) {
    if (!emailIds.has(message.id)) {
      counter.new++;
      const messageRes = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });
      const data = parseEmailContent(messageRes.data);
      data.emailId = message.id;

      if (data) {
        await Receipt.createReceipt(data);
        counter.toDB++;
      }
    }
  }
  console.log(`Found ${counter.new} new Zelle emails`);
  console.log(`Added ${counter.toDB} new Zelle emails to the database`);
}

const create = async (data) => {
  try {
    const userToken = await UserToken.findOne({
      email: process.env.CLIENT_EMAIL,
    });

    if (!userToken) {
      userToken = new UserToken(data);
    } else {
      Object.assign(userToken, data);
    }

    await userToken.save();
  } catch (error) {
    throwError("FAILED", 422, error.message, "0x000C00");
  }
};

const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3600000;

// Poll Gmail every minute
async function startPolling(exit = true) {
  console.log(
    `Starting polling for Gmail with interval: ${POLLING_INTERVAL}ms`
  );

  const poll = async () => {
    try {
      const auth = await getAuthenticatedClient();
      await checkForZelleEmails(auth);
    } catch (error) {
      console.error("Error monitoring Gmail:", error.message);
      if (exit && error.message === "User not authenticated") process.exit(1);
    }
  };

  // Run the poll immediately
  await poll();

  // Set up the interval
  setInterval(poll, POLLING_INTERVAL);
}

async function getAuthenticatedClient() {
  const userToken = await UserToken.findOne({
    email: process.env.CLIENT_EMAIL,
  });
  if (!userToken) throw new Error("User not authenticated");

  oauth2Client.setCredentials({
    access_token: userToken.accessToken,
    refresh_token: userToken.refreshToken,
    expiry_date: userToken.expiryDate,
  });

  // Refresh token if expired
  if (new Date().getTime() > userToken.expiryDate) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    await UserToken.updateOne(
      { email: process.env.CLIENT_EMAIL },
      {
        accessToken: credentials.access_token,
        expiryDate: credentials.expiry_date,
      }
    );
  }

  return oauth2Client;
}

module.exports = { oauth2Client, startPolling, create };
