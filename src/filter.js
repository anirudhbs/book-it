const { getExistingMatchIds, addMatchesToS3 } = require("./s3");

const TEAMS = ["FaZe", "G2", "Liquid", "ENCE", "fnatic"];

async function filterMatches(matches) {
  const matchesWithTwoTeams = getMatchesWithTwoTeams(matches);

  const matchesToAdd = await filterOutExistingMatches(matchesWithTwoTeams);

  setTimeout(() => {
    addMatchesToS3(matchesToAdd);
  }, 5000);

  return await filterMyTeams(matchesToAdd);
}

async function filterOutExistingMatches(matches) {
  const existingMatches = await getExistingMatchIds();

  return matches.filter((match) => !existingMatches.includes(match.id));
}

function getMatchesWithTwoTeams(matches) {
  return matches.filter((match) => match.team1 && match.team2);
}

function filterMyTeams(matches) {
  return matches.filter(
    ({ team1, team2 }) => TEAMS.includes(team1) || TEAMS.includes(team2)
  );
}

module.exports = { filterMatches };
