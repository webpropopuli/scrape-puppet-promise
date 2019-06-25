const express = require("express");
const app = express();

const scraper = require("./utils/scraper");
const { scrapeMedium, scrapeYoutube } = require("./utils/scraper");

app.set("view engine", "pug"); // could be anything

app.get("/", (req, res) => {
  const mediumArticles = new Promise((resolve, reject) => {
    scrapeMedium()
      .then(data => {
        resolve(data);
      })
      .catch(err => reject("Medium scrape failed"));
  });

  const youtubeVideos = new Promise((resolve, reject) => {
    scrapeYoutube()
      .then(data => {
        resolve(data);
      })
      .catch(err => reject("YouTube scrape failed"));
  });

  Promise.all([mediumArticles, youtubeVideos])
    .then(data => {
      res.render("index", { data: { articles: data[0], videos: data[1] } });
    })
    .catch(err => res.status(500).send(err));
});

app.listen(process.env.PORT || 3000);
