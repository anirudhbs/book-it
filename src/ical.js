const ics = require("ics");

function convertToICalEvents(matches) {
  const events = createEventsFromMatches(matches);
  const { value } = ics.createEvents(events);
  const a = getEventsOnly(value);
  console.log("xx", a);
}

function getEventsOnly(value) {
  return value.split("\n").slice(6).slice(0, -2).join("\n");
}

function getMatchDuration(matchType) {
  return { hours: matchType === "bo1" ? 1 : 2 };
}

function createEventsFromMatches(matches) {
  return matches.map((match) => {
    const { team1, team2, event, url, time, matchType } = match;
    return {
      start: ics.convertTimestampToArray(parseFloat(time)),
      duration: getMatchDuration(matchType),
      title: `${team1} vs ${team2}`,
      description: `At the ${event}`,
      location: `https://www.hltv.org${url}`,
    };
  });
}

module.exports = { convertToICalEvents };
