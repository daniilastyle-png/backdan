const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const corsOptions = require("./config/coresOptions");
const News = require("./modules/News");
const SpacialOrder = require("./modules/SpacialOrder");
dotenv.config();
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const PORT = process.env.PORT || 3100;

app.use("/auth", require("./routes/auth"));
app.use("/product", require("./routes/products"));
app.use("/user", require("./routes/user"));
app.use("/hero", require("./routes/hero"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: false,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: "daniila.style@gmail.com",
    pass: "powx rwaq jwbj mnsv",
  },
  tls: {
    rejectUnAuthorized: false,
  },
});
// "iyvw zmxd dspk hemk";
app.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(404).json({ message: "enter you email" });
    const subscriber = await News.create({ email });
    return res.status(200).json({ message: "subscribed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/subsend", async (req, res) => {
  try {
    const { subject, img, text, to } = req.body;

    console.log(req.body);
    if (!subject || !img || !text || !to)
      return res.status(404).json({ message: "enter you email" });
    const info = await transporter.sendMail({
      from: `DaniLA💜, www.daniila.com`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: `<div>
      <h1> <b>${subject}</b></h1>
      <br>
      <h2>From: DaniLA💜 , www.daniila.com </h2>
      <br>
      <h3>${text}</h3>
      <br>
      <img src="${img}" width="400" height="400"/>
      </div>`, // html body
    });
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/subAll", async (req, res) => {
  try {
    const subi = await News.find().lean();
    if (!subi) return res.status(404).json({ message: "enter you email" });
    return res.status(200).json(subi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/Spgeter", async (req, res) => {
  try {
    const sp = await SpacialOrder.find();

    if (!sp && sp.length <= 0) {
      // return res.status(200).json([]);
      return res.status(400).json({ message: "No products found" });
    }
    return res.status(200).json(sp);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.delete("/Spdeleter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const p = await SpacialOrder.findById(id).exec();
    if (!p) return res.status(400).json({ message: "No order found" });
    const result = await p.deleteOne();

    const reply = `order' with ID ${id} was deleted`;
    return res.status(200).json(reply);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
