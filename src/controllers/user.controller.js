const catchError = require("../utils/catchError");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { name, username, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the database
  const result = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  // Send a welcome email
  await sendEmail({
    to: email,
    subject: "Welcome to NewsFlow!",
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
  
        ul {
          color: #666;
          list-style-type: disc;
          padding-left: 20px;
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
        <h1>Welcome to NewsFlow, ${name}!</h1>
        <p class="thank-you-message">
          Thank you for joining our community. We're excited to have you on board!
        </p>
        <p>
          By registering, you get the following advantages:
        </p>
        <ul>
          <li>Save and bookmark your favorite news articles.</li>
          <li>Share your own stories and experiences with people around the world.</li>
          <li>Engage with the community by commenting, liking, and sharing articles.</li>
          <li>Forgot your password? No worries! You can request to update it.</li>
        </ul>
        <p class="newsletter-team">
          Enjoy your journey with NewsFlow!<br>Your NewsFlow Team
        </p>
      </div>
    </body>
  </html>
  
    `,
  });

  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "invalid credentials" });

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ user, token });
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
};
