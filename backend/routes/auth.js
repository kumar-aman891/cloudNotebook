const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "Ammanisagoodboy";
const jwt = require("jsonwebtoken");

//create a user using: POST "/api/auth/createuser". No login required
//Route1

router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    //if there are errors the return bad request and the errors , the function will return and no further execution will take place
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //check whther the user with this email exist already
    try {
      //will see if there is any existing user with the same email in the database user (exported and imported as User) in the iNotebook on mongoDB
      let user = await User.findOne({ email: req.body.email });
      //if there is a user then set the status of the response as 400 and,response also returns a promise,so we return a json with the error
      if (user) {
        return res
          .status(400)
          .json({success, error: "sorry this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      //if user doesnt exist then we create a new user with  the details received in the body of request
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken }); //{authtoken:authtoken}
    } catch (error) {
      //if the promise is not resolved/rejected the we catch the error and return accordingly
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Authenticate a user using: POST "/api/auth/login".
//Route2

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors the return bad request and the errors , the function will return and no further execution will take place
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //using destructuring we will take out the email and password out from req.body
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password); //will return the true or false
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success =true;
      res.json({ success, authToken });
    } catch (error) {
      //if the promise is not resolved/rejected the we catch the error and return accordingly
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route3 .. Get logged in user details ,  using  POST "/api/auth/getuser" .login required..meaning hum yaha per apna token use karenge
//we first need to decode the authtoken and take the userid from it and then get the data with that id
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //want everything except the password
    res.send(user);
  } catch (error) {
    //if the promise is not resolved/rejected the we catch the error and return accordingly
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});
module.exports = router;
