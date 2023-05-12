const ics = require("ics");

function generateICalEvents(matches) {
  const events = createEventObjectArray(matches);
  const { value } = ics.createEvents(events);
  return getEventsOnly(value);
}

function getEventsOnly(value) {
  return value.split("\n").slice(6).slice(0, -2).join("\n");
}

function getMatchDuration(matchType) {
  return { hours: matchType === "bo1" ? 1 : 2 };
}

function getTitle(team1, team2) {
  return `${team1} vs ${team2}`;
}

function getDescription(event) {
  return `At the ${event}`;
}

function getUrl(url) {
  return `https://www.hltv.org${url}`;
}

function createEventObjectArray(matches) {
  return matches.map((match) => {
    const { team1, team2, event, url, time, matchType } = match;

    return {
      start: ics.convertTimestampToArray(parseFloat(time)),
      duration: getMatchDuration(matchType),
      title: getTitle(team1, team2),
      description: getDescription(event),
      location: getUrl(url),
    };
  });
}

module.exports = { generateICalEvents };
