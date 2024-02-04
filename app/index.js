import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/redirect_login", (req, res) => {
  res.render("redirect_login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/cellar", async (req, res) => {
  console.log(req.user);


  ////////////////UPDATED GET SECRETS ROUTE/////////////////
  if (req.isAuthenticated()) {
    try {
      const username_result = await db.query(
        'SELECT username FROM users WHERE email = $1',
        [req.user.email]
      );

      const temp_1_result = await db.query(
        'SELECT temp_1 FROM users WHERE email = $1',
        [req.user.email]
      );
      const set_temp_1_result = await db.query(
        'SELECT set_temp_1 FROM users WHERE email = $1',
        [req.user.email]
      );
      const hysterisis_1_result = await db.query(
        'SELECT hysterisis_1 FROM users WHERE email = $1',
        [req.user.email]
      );
            
      const temp_2_result = await db.query(
        'SELECT temp_2 FROM users WHERE email = $1',
        [req.user.email]
      );
      const set_temp_2_result = await db.query(
        'SELECT set_temp_2 FROM users WHERE email = $1',
        [req.user.email]
      );
      const hyst_2_result = await db.query(
        'SELECT hyst_2 FROM users WHERE email = $1',
        [req.user.email]
      );

      const temp_3_result = await db.query(
        `SELECT temp_3 FROM users WHERE email = $1`,
        [req.user.email]
      );
      const set_temp_3_result = await db.query(
        `SELECT set_temp_3 FROM users WHERE email = $1`,
        [req.user.email]
      );
      const hyst_3_result = await db.query(
        'SELECT hyst_3 FROM users WHERE email = $1',
        [req.user.email]
      );

      const temp_4_result = await db.query(
        'SELECT temp_4 FROM users WHERE email = $1',
        [req.user.email]
      );
      const set_temp_4_result = await db.query(
        'SELECT set_temp_4 FROM users WHERE email = $1',
        [req.user.email]
      );
      const hyst_4_result = await db.query(
        'SELECT hyst_4 FROM users WHERE email = $1',
        [req.user.email]
      );

      const username = username_result.rows[0].username;

      const temp_1 = temp_1_result.rows[0].temp_1;
      const set_temp_1 = set_temp_1_result.rows[0].set_temp_1;
      const hysterisis_1 = hysterisis_1_result.rows[0].hysterisis_1;

      const temp_2 = temp_2_result.rows[0].temp_2;
      const set_temp_2 = set_temp_2_result.rows[0].set_temp_2;
      const hyst_2 = hyst_2_result.rows[0].hyst_2;

      const temp_3 = temp_3_result.rows[0].temp_3;
      const set_temp_3 = set_temp_3_result.rows[0].set_temp_3;
      const hyst_3 = hyst_3_result.rows[0].hyst_3;

      const temp_4 = temp_4_result.rows[0].temp_4;
      const set_temp_4 = set_temp_4_result.rows[0].set_temp_4;
      const hyst_4 = hyst_4_result.rows[0].hyst_4;

      res.render("cellar.ejs", { username: username, set_temp_1: set_temp_1, hysterisis_1: hysterisis_1, temp_1: temp_1, set_temp_2: set_temp_2, hyst_2: hyst_2, temp_2: temp_2, set_temp_3: set_temp_3, hyst_3: hyst_3, temp_3: temp_3, set_temp_4: set_temp_4, hyst_4: hyst_4, temp_4: temp_4} );
      
      /*
      var qvevri_1 = "grid-item_1";
           
      if (temp_1 > set_temp_1){
        qvevri_1.body.style.backgroundcolor = "green";
        document.querySelector(".temp_3-text").style.backgroundColor = "green";
        console.log("hello")
      };
      /*if (temp_1) {
        res.render("cellar.ejs", { set_temp_1: set_temp_1, hysterisis_1: hysterisis_1, temp_1: temp_1, set_temp_2: set_temp_2, hyst_2: hyst_2, temp_2: temp_2, set_temp_3: set_temp_3, hyst_3: hyst_3, temp_3: temp_3, set_temp_4: set_temp_4, hyst_4: hyst_4, temp_4: temp_4});
        
      }
      else {
        res.render("cellar.ejs", { temp_1: "Connection Lost!", set_temp_1: set_temp_1, hysterisis_1: hysterisis_1 });
      }*/
    

  } catch (err) {
    console.log(err);
  }

  } else {
    res.redirect("/login");
  }

});






////////////////SUBMIT GET ROUTE/////////////////
/*app.get("/submit_temp", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit_temp.ejs");
  } else {
    res.redirect("/login");
  }
});

app.get("/submit_hyst", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit_hyst.ejs");
  } else {
    res.redirect("/login");
  }
});
*/

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/cellar",
  passport.authenticate("google", {
    successRedirect: "/cellar",
    failureRedirect: "/login",
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/cellar",
    failureRedirect: "/login",
  })
);

app.post(
  "/register", 
  async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/redirect_login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/cellar");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});


////////////////SUBMIT POST ROUTE/////////////////




app.post("/Temp1", async function (req, res) {
  const setTemp_1 = req.body.Temperature_1;
  console.log(req.user);
  try {
    await db.query('UPDATE users SET set_temp_1 = $1 WHERE email = $2', [
      setTemp_1,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Temp2", async function (req, res) {
  const setTemp_2 = req.body.Temperature_2;
  try {
    await db.query('UPDATE users SET set_temp_2 = $1 WHERE email = $2', [
      setTemp_2,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Temp3", async function (req, res) {
  const setTemp_3 = req.body.Temperature_3;
  try {
    await db.query('UPDATE users SET set_temp_3 = $1 WHERE email = $2', [
      setTemp_3,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Temp4", async function (req, res) {
  const setTemp_4 = req.body.Temperature_4;
  try {
    await db.query('UPDATE users SET set_temp_4 = $1 WHERE email = $2', [
      setTemp_4,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Hyst1", async function (req, res) {
  const setHyst_1 = req.body.Hysterisis_1;
  try {
    await db.query('UPDATE users SET hysterisis_1 = $1 WHERE email = $2', [
      setHyst_1,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Hyst2", async function (req, res) {
  const setHyst_2 = req.body.Hysterisis_2;
  try {
    await db.query('UPDATE users SET hyst_2 = $1 WHERE email = $2', [
      setHyst_2,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Hyst3", async function (req, res) {
  const setHyst_3 = req.body.Hysterisis_3;
  try {
    await db.query('UPDATE users SET hyst_3 = $1 WHERE email = $2', [
      setHyst_3,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});

app.post("/Hyst4", async function (req, res) {
  const setHyst_4 = req.body.Hysterisis_4;
  try {
    await db.query('UPDATE users SET hyst_4 = $1 WHERE email = $2', [
      setHyst_4,
      req.user.email,
    ]);
    res.redirect("/cellar");
  } catch (err) {
    console.log(err);
  }
});




passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            return cb("Incorrect email or password, please try again.");
            console.error("Error comparing passwords:", err);
            
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/cellar",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//var output = [];
//if(n === 1){
        //output = [0];}
//else if(n === 2){
      //  output = [0,1];}
//else{
  //  output = [0,1];
  //  for(var i = 2; i < n; i++){
    //    output.push(output[output.length - 2] + output[output.length - 1]);
//}
//}



