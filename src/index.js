const { getMatches } = require("./scrape");
const { generateICalEvents } = require("./ical");
const { updateICSFile } = require("./s3");
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
  const allMatches = await getMatches();
  const filteredMatches = await filterMatches(allMatches);
  const newEvents = generateICalEvents(filteredMatches);

  await updateICSFile(newEvents);
  return;
}

main();
