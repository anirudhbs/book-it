const { getMatchDetails } = require("./scrape");
const { convertToICalEvents } = require("./ical");
const { pushToS3 } = require("./s3");
const { filterMatches } = require("./filter");

// Event:
// {
//   id: "2363861",
//   url: "/matches/2363861/9ine-vs-liquid-blasttv-paris-major-2023",
//   matchType: "bo1",
//   team1: "9INE",
//   team2: "Liquid",
//   time: "1683970200000",
//   event: "BLAST.tv Paris Major 2023",
// }

async function main() {
  const matchDetails = await getMatchDetails();
  const filteredMatches = filterMatches(matchDetails);
  const newEvents = convertToICalEvents(filteredMatches);

  await pushToS3(newEvents);
  return;
}

main();
