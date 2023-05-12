const TEAMS = ["FaZe", "G2", "Liquid", "ENCE", "fnatic"];

function filterMatches(matches) {
  return filterMyTeams(matches);
}

function filterMyTeams(matches) {
  return matches.filter(
    ({ team1, team2 }) => TEAMS.includes(team1) || TEAMS.includes(team2)
  );
}

module.exports = { filterMatches };
