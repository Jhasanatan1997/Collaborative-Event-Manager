const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // This should match the redirect URI set in Google Cloud Console
);

// Get authentication URL
exports.getAuthURL = () => {
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });
};

// Set credentials after authentication
exports.setCredentials = (tokens) => {
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
};

module.exports = oauth2Client;