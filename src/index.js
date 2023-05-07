const puppeteer = require("puppeteer");

async function scrapePage() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/matches?predefinedFilter=lan_only");
  const content = await page.content();
  const matchSelector = ".upcomingMatch";
  const upcomingMatches = await page.$$(matchSelector);
  //  ideal shape: {id: "", url: "", team1: "", team2: "", time: "", event: ""}

  const g = await upcomingMatches[0].evaluate((el) => {
    const currentMatchData = {};
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

    return currentMatchData;
  }, await page.$(".matchTeamName"));
  // const p = await matches[0].("textContent");
  console.log("g", g);

  console.log("total", upcomingMatches.length);
}

scrapePage();
