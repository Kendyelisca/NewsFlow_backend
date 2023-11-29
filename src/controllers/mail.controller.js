const catchError = require("../utils/catchError");
const Mail = require("../models/Mail");
const sendEmail = require("../utils/sendEmail");

const getAll = catchError(async (req, res) => {
  const results = await Mail.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const result = await Mail.create(req.body);
  const { email } = req.body;

  const mailOptions = {
    to: email,
    subject: "Welcome to NewsFlow's Newsletter!",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
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
              color: #333;
            }
            p {
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to our Newsletter!</h1>
            <p>
              Thank you for subscribing. We're excited to share our latest news and updates with you.
            </p>
            <p>Best regards,<br>Your Newsletter Team</p>
          </div>
        </body>
      </html>
    `,
  };

  // Send the email using the utility
  try {
    await sendEmail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Handle error
    return res.status(500).json({ error: "Failed to send welcome email" });
  }

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
