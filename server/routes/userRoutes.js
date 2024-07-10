const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
    try{

        const UserExist = await User.findOne({email: req.body.email});
        if(UserExist) return res.status(400).json("Email already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json("User has been registered");

    }
    catch(err){
        res.status(500).json(err);
    }

});

router.post("/login", async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  if(!user) {
    res.send({
      success: false,
      message: 'User not found, please register'
    })
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword) {
        res.send({
        success: false,
        message: 'Invalid password'
        })
    }
    else{
        res.send({
            success: true,
            message: 'Login successful'
    });
    }
});


module.exports = router;