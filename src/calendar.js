const { authenticate } = require("@google-cloud/local-auth");
const credentials = require("./credentials");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const client = {};
async function getCredentials() {
  try {
    return google.auth.fromJSON({
      type: "authorized_user",
      client_id: credentials.id,
      client_secret: credentials.secret,
      refresh_token: google.auth.cachedCredential?._refreshToken || "",
    });
  } catch (err) {
    console.log("err", err);
    return null;
  }
}

async function authorize() {
  const client = await getCredentials();
  console.log("c", client);
  // if (client.credentials) {
  //   await saveCredentials(client);
  // }
  return client;
}

// async function listEvents(auth) {
//   const calendar = google.calendar({ version: "v3", auth });
//   const res = await calendar.events.list({
//     calendarId: "primary",
//     timeMin: new Date().toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: "startTime",
//   });
//   const events = res.data.items;
//   if (!events || events.length === 0) {
//     console.log("No upcoming events found.");
//     return;
//   }
//   console.log("Upcoming 10 events:");
//   events.map((event, i) => {
//     const start = event.start.dateTime || event.start.date;
//     console.log(`${start} - ${event.summary}`);
//   });
// }

authorize()
  .then((res) => {
    console.log("r", res);
  })
  .catch(console.error);
