const catchError = require("../utils/catchError");
const Mail = require("../models/Mail");
const sendEmail = require("../utils/sendEmail");

const getAll = catchError(async (req, res) => {
  const results = await Mail.findAll();
  return res.json(results);
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
