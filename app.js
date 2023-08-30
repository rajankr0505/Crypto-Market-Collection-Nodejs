const express = require("express");
const app = express();
require("./src/db/connect");
require("dotenv").config();
const bcrypt=require("bcrypt");
const User = require("./src/models/userdata");
const Register=require('./src/models/registration');
const hbs = require("hbs");
const auth=require("./src/middleware/auth");

const path = require("path");
const port = process.env.PORT || 5000;

// ******** it is for html file*************
const staticPath = path.join(__dirname, "./public");

app.use(express.static(staticPath));
// ****************************

// path set
const templatePath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { log } = require("console");
app.use(express.json());
app.use(cookieParser());

// post json data in db using this
app.use(express.urlencoded({ extended: false }));
// middleware
app.use(
  "/css",
  express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "./node_modules/bootstrap/dist/js"))
);
app.use(
  "/jq",
  express.static(path.join(__dirname, "./node_modules/jquery/dist"))
);
app.use(
  "/userjs",
  express.static(path.join(__dirname, "./public/javascript"))
);

// set view engine
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
// get files
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/elplore_nft", (req, res) => {
  res.render("nft");
});
app.get("/abouts", (req, res) => {
  res.render("abouts");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/registration", (req, res) => {
  res.render("registration");
});

// logout section page
app.get("/logout", auth, async (req, res) => {
  try {
    // for single devices logout

    // req.user.tokens = req.user.tokens.filter((currElement) => {
    //   return currElement.token !== req.token;
    // });
    // ////////

    // logout from all devices
    req.user.tokens = [];
    // ////////

    res.clearCookie("jwt");
    console.log("logout successfully");
    await req.user.save();
    res.render("login");
  } catch (err) {
    res.status(500).send(err);
  }
});
// for contact page
app.post("/contact", async (req, res) => {
  try {
    const userData = new User(req.body);
    await userData.save();
    res.status(200).render("index");
  } catch (e) {
    res.status(500).send(e);
  }
});

// for registration page
app.post("/registration", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const employeePassword = await Register({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      // console.log("the success part" + employeePassword);
      // const token = await employeePassword.generateAuthToken();
      // console.log(token);

      // // cookies create
      // res.cookie("jwt", token, {
      //   expires: new Date(Date.now() + 30000),
      //   httpOnly: true,
      // });
      // console.log(cookie);
       
      const postRegister= await employeePassword.save();
      res.status(200).render("login");
    } else {
      res.send("Password not match");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});


// for login page
app.post("/login", async (req, res) => {
  try {
    const emails = req.body.email;
    const passwords = req.body.password;
    const useremail = await Register.findOne({ email: emails });

    // hashing password matching in login page
    const matchPassword = await bcrypt.compare(passwords, useremail.password);
    const token = await useremail.generateAuthToken();
    console.log(token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true,
      // secure: true,
    });

    if (matchPassword) {
      res.status(200).render("login");
    } else {
      res.send("Password are not matching");
    }
  } catch (e) {
    res.status(500).send("invalid email");
  }
});



app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});
