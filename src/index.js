const { getMatchDetails } = require("./scrape");
const { convertToICalEvents } = require("./ical");
const { pushToS3 } = require("./s3");
const TEAMS = ["FaZe", "G2", "Liquid"];

const MOCK_EVENTS = [
  {
    id: "2363861",
    url: "/matches/2363861/9ine-vs-liquid-blasttv-paris-major-2023",
    matchType: "bo1",
    team1: "9INE",
    team2: "Liquid",
    time: "1683970200000",
    event: "BLAST.tv Paris Major 2023",
  },
  {
    id: "2363866",
    url: "/matches/2363866/vitality-vs-g2-blasttv-paris-major-2023",
    matchType: "bo1",
    team1: "Vitality",
    team2: "G2",
    time: "1683986400000",
    event: "BLAST.tv Paris Major 2023",
  },
];

function filterMatches(matches) {
  return matches.filter(
    ({ team1, team2 }) => TEAMS.includes(team1) || TEAMS.includes(team2)
  );
}

async function main() {
  const matchDetails = await getMatchDetails();
  const filteredMatches = filterMatches(matchDetails);
  const newEvents = convertToICalEvents(filteredMatches);

  await pushToS3(newEvents);
  return;
}

main();
