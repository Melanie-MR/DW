require("dotenv").config()

//IMPORTS
const express = require("express"); 
const bcrypt = require("bcryptjs"); 
const jsonwebtoken = require("jsonwebtoken")
const body_parser = require("body-parser");
const cors = require("cors"); 
const sequelize = require("./config/connection"); //To import db connection
const PORT = process.env.PORT || 5503;

//IMPORT MODELS
const {
  Users,
  Regions,
  Countries,
  Cities,
  Companies,
  Contacts,
} = require("./models/index");

//APP
const app = express();

app.use(cors());
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

//BACK

//JWT - Login with token
app.post('/auth', validateLogin, (req, res) =>{
  const username = req.body.username;
  const user_id = req.user.id;
  //consu;tar bd y validar que existen tanto username como password
  const user = {id: user_id};// Se crea un objeto con id de usuario para generar el token
  const accessToken = generateAccessToken(user);
  res.send({
      message: 'User authenticated',
      token: accessToken
  });

})

//////CREATE USERS

//Sign up new user
app.post('/signup', validateSignup, validateUser, async(req, res) => {

  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin =  req.body.admin;

  try {
      const newUser = await Users.create({
          username: username,
          firstname : firstname,
          lastname : lastname,
          email : email,
          isAdmin : isAdmin,
          password : await bcrypt.hash(password, 5) //password encrypted
      })
      res.status(201).send({msg:'User created successfully', newUser});  
  } catch (error) {
      res.status(400).send({msg:'Something happened ' + error});  
  }
});

///////////////////VALIDATE FUNCTIONS/////////////////// 

//Validate singup- valid information to create a new user (mandatory fields and password restriction)

async function validateSignup(req, res, next){
  if (req.body.username == '' || req.body.firstname == '' || req.body.email == '' ||
      req.body.lastname == '' || req.body.isAdmin == '' || req.body.password == '') {
          
      res.status(400).send({msg:'One or more mandatory fields are empty'});  
  } else if (req.body.password.length < 8){
      res.status(400).send({msg:'Password must have 8 digits'});  

  } else  {
      next()
  }
}

//To verify if user is not already registered. 
async function validateUser(req, res, next){
  const username = req.body.username;
  const email = req.body.email;

  const usernameExists = await Users.findOne({where: {username:username}});
  const emailExists = await Users.findOne({where: {email:email}});

  if (usernameExists || emailExists){
      res.status(400).send({msg:'Username or email already exists'});  
  } else {
      next()
  }
}
//Validate login - correct information to user login
async function validateLogin(req, res, next){
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (username == '' || email == ''){
      res.status(400).send({msg:'Username or email required'});  
  } else if ( password == '') {
      res.status(400).send({msg:'Password required'});  
  }
  let usernameExists = false;
  let emailExists = false;
  if (username) {
      usernameExists = await Users.findOne({where: {username:username}});
  } else if (email) {
      emailExists = await Users.findOne({where: {email:email}});
  }

  let registeredUser = null;
  if (usernameExists) {
      registeredUser = usernameExists;
  } else if (emailExists) {
      registeredUser = emailExists;
  } else {
      res.status(400).send({msg:'Username or email not exists'});
  }

  const result = bcrypt.compare(password, registeredUser.password);

  if (result){
      req.user = registeredUser;
      next();
  } else {
      res.status(400).send({msg:'Password incorrect'});  
  }


}

//To generate the token from a user object with user id
function generateAccessToken(user){
  return jsonwebtoken.sign(user, process.env.SECRET, {expiresIn: '50m'});
}
//SERVER
app.listen(PORT, () => {
  console.log(`Server started to listen in port ${PORT}`);
});