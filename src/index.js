const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// create application/json parser

app.use(express.json());
const { Builder, By, Key, until } = require('selenium-webdriver');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var options = new chrome.Options();
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--headless');
app.use(cors());

app.post('/', async (req, res) => {
  const array = req.body.array;
  const user = req.body.user;

  console.log(req.body);
  for (let i = 0; i < array.length; i++) {
    const job = array[i];

    setTimeout(async () => {
      var driver = new Builder()
        .usingServer('http://localhost:9515')
        .withCapabilities({ browserName: 'chrome' })
        .build();
      await driver.get(job.applyUrl).then(async () => {
        await driver
          .findElement(By.name('name'))
          .sendKeys(`${user.firstName} ${user.lastName}`)
          .then(async () => {
            await driver
              .findElement(By.name('email'))
              .sendKeys(user.email)
              .then(async () => {
                await driver
                  .findElement(By.name('phone'))
                  .sendKeys(user.phone)
                  .then(async () => {
                    await driver.quit();

                    res.send('done');
                  });
              });
          });
      });
    }, i * 10000);
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});

module.exports = server;
