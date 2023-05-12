const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3ClientSettings } = require("./config");

const client = new S3Client(s3ClientSettings);

async function getFileContents() {
  const command = new GetObjectCommand({
    Bucket: "flusha",
    Key: "cs.ics",
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    return str;
  } catch (err) {
    console.error(err);
  }
}

async function updateICSFile(newEvents) {
  const existing = await getFileContents();
  const newContent = addNewEvents(existing, newEvents);
  await updateFile(newContent);
  return;
}

function addNewEvents(existing, newEvents) {
  const trimmedFile = trimEndOfFile(existing);
  return trimmedFile + "\n" + newEvents + "\nEND:VCALENDAR\n";
}

function trimEndOfFile(content) {
  return content.split("\n").slice(0, -2).join("\n");
}

async function updateFile(content) {
  const command = new PutObjectCommand({
    Bucket: "flusha",
    Key: "cs.ics",
    Body: content,
    ACL: "public-read",
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { updateICSFile };
