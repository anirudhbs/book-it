const puppeteer = require("puppeteer");

async function getMatchDetails() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/matches?predefinedFilter=lan_only");
  const nodes = await page.$$(".upcomingMatch");

  return Promise.all(
    nodes.map((currentMatch) => getIndividualMatchDetails(page, currentMatch))
  );
}

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

module.exports = { getMatchDetails };
