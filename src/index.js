const puppeteer = require("puppeteer");
const TEAMS = ["FaZe", "G2", "Liquid"];

async function getIndividualMatchDetails(page, currentMatch) {
  return currentMatch.evaluate((el) => {
    const url = el.querySelector("a.match").getAttribute("href");
    const id = url.split("/")[2];
    const matchType = el.querySelector(".matchInfo > .matchMeta").textContent;
    const currentMatchData = { id, url, matchType };

    if (!el.querySelector(".team1 > .matchTeamName")) {
      return currentMatchData;
    }

    const team1 = el.querySelector(".team1 > .matchTeamName")?.textContent;
    const team2 = el.querySelector(".team2 > .matchTeamName")?.textContent;
    const time = el.querySelector(".matchTime").getAttribute("data-unix");
    const event = el.querySelector(".matchEvent > .matchEventName").textContent;

    return { ...currentMatchData, team1, team2, time, event };
  }, await page.$(".matchTeamName"));
}

async function getMatchDetails() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const matchSelector = ".upcomingMatch";

  await page.goto("https://www.hltv.org/matches?predefinedFilter=lan_only");
  const nodes = await page.$$(matchSelector);

  return Promise.all(
    nodes.map((currentMatch) => getIndividualMatchDetails(page, currentMatch))
  );
}

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
