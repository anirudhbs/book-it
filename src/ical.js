const ics = require("ics");

function createiCalFile(matches) {
  const match = matches[0];
  const { team1, team2, event, url, time, matchType } = match;

  const event1 = {
    start: ics.convertTimestampToArray(parseInt(time)),
    duration: getMatchDuration(matchType),
    title: `${team1} vs ${team2}`,
    description: `At the ${event}`,
    location: `https://www.hltv.org${url}`,
  };

  ics.createEvent(event1, (error, value) => {
    if (error) {
      console.log("err", error);
      return;
    }
    console.log(value);
  });
}

function getMatchDuration(matchType) {
  return { hours: matchType === "bo1" ? 1 : 2 };
}

createiCalFile([
  {
    id: "2363866",
    url: "/matches/2363866/vitality-vs-g2-blasttv-paris-major-2023",
    matchType: "bo1",
    team1: "Vitality",
    team2: "G2",
    time: "1683986400000",
    event: "BLAST.tv Paris Major 2023",
  },
]);
