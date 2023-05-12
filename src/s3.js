const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
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
    await client.send(command);
    console.log("done");
    return;
  } catch (err) {
    console.error("Error updating file", err);
  }
}

async function getExistingMatchIds() {
  const command = new ListObjectsCommand({
    Bucket: "flusha",
  });

  try {
    const response = await client.send(command);
    return response.Contents.map(({ Key }) => Key).filter((key) =>
      key.includes(".match")
    );
  } catch (err) {
    console.error(err);
  }
}

function addMatchesToS3(ids) {
  ids.forEach(async (match) => {
    const command = new PutObjectCommand({
      Bucket: "flusha",
      Key: `${match.id}.match`,
      Body: "t",
      Expires: new Date("2023-05-18"),
    });

    try {
      await client.send(command);
      return;
    } catch (err) {
      console.error("Error adding match", err);
    }
  });
}

module.exports = {
  updateICSFile,
  addMatchesToS3,
  getExistingMatchIds,
};
