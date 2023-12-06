const catchError = require("../utils/catchError");
const Mail = require("../models/Mail");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");
const cron = require("node-cron");

const getAll = catchError(async (req, res) => {
  const results = await Mail.findAll();
  if (res) {
    return res.json(results);
  } else {
    console.error("Response object is undefined.");
  }
});

const create = catchError(async (req, res) => {
  const { email } = req.body;

  await sendEmail({
    to: email,
    subject: "Welcome to NewsFlow's Newsletter!",
    html: `
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
  
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
  
        h1 {
          color: #ff0000; /* Red Title */
        }
  
        p {
          color: #666;
          line-height: 1.5;
        }
  
        .thank-you-message {
          font-weight: bold;
        }
  
        .newsletter-team {
          margin-top: 20px;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to our Newsletter!</h1>
        <p class="thank-you-message">
          Thank you for subscribing. We're thrilled to have you on board!
        </p>
        <p>
          Get ready to stay informed with the latest updates on upcoming events, exclusive content, and more.
        </p>
        <p class="newsletter-team">
          Best regards,<br>Your Newsletter Team
        </p>
      </div>
    </body>
  </html>
`,
  });

  const result = await Mail.create({
    email,
  });

  return res.status(201).json(result);
});

const fetchAndSendNewsletter = async () => {
  console.log("Cron job started");
  const apiKey = process.env.API_KEY;
  try {
    // Step 2: Fetch latest news from GNews API
    const newsResponse = await axios.get(
      `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${apiKey}`
    );
    const latestNews = newsResponse.data.articles.slice(0, 5);

    // Step 3: Retrieve subscribed users
    const subscribedUsers = await Mail.findAll();

    // Step 4: Prepare email options array
    const emailOptionsArray = subscribedUsers.map((mail) => ({
      to: mail.email,
      subject: "Latest News Update from NewsFlow",
      html: composeNewsletterEmail(mail.email, latestNews),
    }));

    // Step 5: Send emails in parallel
    await Promise.all(emailOptionsArray.map(sendEmailWithRetry));

    console.log("Newsletter sent to all subscribed users");
  } catch (error) {
    console.error("Error fetching news or sending newsletters:", error);
  }
};

const sendEmailWithRetry = async (emailOptions) => {
  let retries = 3;
  while (retries > 0) {
    try {
      await sendEmail(emailOptions);
      console.log("Email sent successfully");
      break; // Break out of the loop if successful
    } catch (error) {
      console.error("Error sending email:", error);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
};

const composeNewsletterEmail = (userName, latestNews) => {
  // Compose the email content with the latest news
  const newsList = latestNews.map((article) => {
    return `
      <div style="margin-bottom: 20px;">
        <h2 style="color: #333;">${article.title}</h2>
        <p style="color: #666;">${article.description}</p>
        <p style="color: #666; font-style: italic;">Published on: ${new Date(
          article.publishedAt
        ).toLocaleString()}</p>
        <a href="${article.url}" style="color: #ff0000;">Read more</a>
      </div>
    `;
  });

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h1 {
            color: #ff0000; /* Red Title */
          }

          p {
            color: #666;
            line-height: 1.5;
          }

          a {
            color: #ff0000;
            text-decoration: none;
          }

          .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #808080;
            color:  #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }

          .newsletter-team {
            margin-top: 20px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello ${userName}!</h1>
          <p>Here are the latest updates from NewsFlow:</p>
          ${newsList.join("")}
          <p class="newsletter-team">
            Enjoy staying informed with NewsFlow!<br>Your NewsFlow Team
          </p>
          <a href="https://news-flow-two.vercel.app/" class="btn">Go to NewsFlow App</a>
        </div>
      </body>
    </html>
  `;
};

//cron.schedule("*/20 * * * * *", fetchAndSendNewsletter);

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Mail.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Mail.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Mail.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
