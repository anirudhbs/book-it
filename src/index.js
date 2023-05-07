const puppeteer = require("puppeteer");

async function scrapePage() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/matches?predefinedFilter=lan_only");
  const content = await page.content();
  const matchSelector = ".upcomingMatch";
  const upcomingMatches = await page.$$(matchSelector);
  //  ideal shape: {id: "", url: "", team1: "", team2: "", time: "", event: ""}

  const matchDetails = upcomingMatches.slice(0, 3).map(async (currentMatch) => {
    return await getMatchDetails(page, currentMatch);
  });
  console.log(matchDetails);
}

async function getMatchDetails(page, currentMatch) {
  return currentMatch.evaluate(async (el) => {
    const currentMatchData = {};
    if (!el.querySelector(".team1 > .matchTeamName")) {
      return {};
    }
    const url = el.querySelector("a.match").getAttribute("href");
    const id = url.split("/")[2];
    const team1 = el.querySelector(".team1 > .matchTeamName").textContent;
    const team2 = el.querySelector(".team2 > .matchTeamName").textContent;
    const time = el.querySelector(".matchTime").getAttribute("data-unix");

    currentMatchData.id = id;
    currentMatchData.url = url;
    currentMatchData.team1 = team1;
    currentMatchData.team2 = team2;
    currentMatchData.time = time;

    return await currentMatchData;
  }, await page.$(".matchTeamName"));
}

scrapePage();
