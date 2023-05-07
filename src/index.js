const puppeteer = require("puppeteer");

async function scrapePage() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.hltv.org/matches?predefinedFilter=lan_only");
  const content = await page.content();
  // console.log("pagep", content);
}

scrapePage();
