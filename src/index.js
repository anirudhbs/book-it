const { getMatchDetails } = require("./scrape");

const TEAMS = ["FaZe", "G2", "Liquid"];

function filterMatches(matches) {
  return matches.filter(
    ({ team1, team2 }) => TEAMS.includes(team1) || TEAMS.includes(team2)
  );
}

async function main() {
  const matchDetails = await getMatchDetails();
  const filteredMatches = filterMatches(matchDetails);

  console.log(filteredMatches);
  return;
}

main();
