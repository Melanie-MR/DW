require("dotenv").config()

//IMPORTS
const express = require("express"); 
const bcrypt = require("bcryptjs"); 
const jsonwebtoken = require("jsonwebtoken")
const body_parser = require("body-parser");
const cors = require("cors"); 
const sequelize = require("./config/connection"); //To import db connection
const PORT = process.env.PORT || 3000; 
const { Op } = require("sequelize");

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

/////////////////////BACK///////////////////////////////

////////ENDPOINTS///////////

//////////COMPANIES/////////

//CREATE - ADD COMPANIES (create) 

app.post("/companies", authUser,  async (req, res) => {
    let name = req.body.name
    let address = req.body.address
    let email = req.body.email
    let phone_number = req.body.phone_number
    let cities_id = req.body.cities_id

    //let description = req.body.description
    
    try {
        const newCompany = await Companies.create({
            name: name,
            address: address,
            email:email,
            phone_number: phone_number,
            cities_id:cities_id,
        })
        res.status(200).send({msg:'Company created successfully', newCompany});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});


//GET COMPANIES -- Read ALL COMPANIES.

app.get('/companies', async (req, res) => { 
    try {
        const companies =  await Companies.findAll({
            include: [{
              model: Cities,
              //required: true
             }]
          });
        res.status(200).send({msg:'These are all the companies', companies});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});

//EDIT COMPANY 
app.put("/companies/:id", async (req, res) => {
    
    const {name, address, email, phone_number, cities_id} = req.body;
    const idParam = req.params.id;
    const newCompany = await Companies.update(
      {
        name, 
        address, 
        email, 
        phone_number, 
        cities_id,
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    res.status(201).send({msg:'Company updated successfully', newCompany});
  });

//DELETE COMPANY 
app.delete('/companies/:id', authUser, isAdmin, async (req, res) => { 
  let id = req.params.id
  try {
      const status =  await Companies.destroy({
          where: {
             id: id  
          }
      }) 
      if (status == 0) {
          res.status(404).send({msg: `There is not Company with the id ${id} to be eliminated`})
      } else {
          res.status(200).send({msg: "DELETED"});
      }
  } catch (error) {
      res.status(400).send({msg:'Something happened ' + error});  
  }
});


///////CONTACTS///////////

//Search contacts

app.get('/searchcontacts', authUser, async (req, res) => {
    let search = req.query.search
    try {
        const contacts =  await Contacts.findAll({
            where: {
                [Op.or]: [
                    { firstname: { [Op.like]: '%' + search + '%' } },
                    { lastname: { [Op.like]: '%' + search + '%' } },
                    { position: { [Op.like]: '%' + search + '%' } },
                    { email: { [Op.like]: '%' + search + '%' } },
                    { address: { [Op.like]: '%' + search + '%' } },        
                  ]
            },
            include: [{
              model: Cities,
            },
            {
              model: Companies,
            }]
          });
        res.status(200).send({msg:'These are all the contacts', contacts});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});

//GET CONTACTS -- Read ALL contacts.

app.get('/contacts',authUser, async (req, res) => {
    try {
        const contacts =  await Contacts.findAll({
            include: [{
              model: Cities,
              //required: true
             },
             {
                model: Companies,
                //required: true
            }]
          });
        res.status(200).send({msg:'These are all the contacts', contacts});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});

//CREATE - ADD CONTACT (create) 

app.post("/contacts", authUser,  async (req, res) => {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let position = req.body.position
    let email = req.body.email
    let address = req.body.address
    let cities_id = req.body.cities_id
    let companies_id = req.body.companies_id 
    let interest = req.body.interest


    //let description = req.body.description
    
    try {
        const newContact = await Contacts.create({
            firstname: firstname,
            lastname: lastname,
            position:position,
            email:email,
            address:address,
            cities_id:cities_id,
            companies_id: companies_id,
            interest: interest
        })
        res.status(200).send({msg:'Contact created successfully', newContact});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});

//EDIT CONTACTS 
app.put("/contacts/:id", authUser, async (req, res) => {
    
    const {firstname, lastname, position, email, company, address, country, cities_id, companies_id, interest} = req.body;
    const idParam = req.params.id;
    const newContact = await Contacts.update(
      {
        firstname, 
        lastname, 
        position, 
        email, 
        company, 
        address, 
        country, 
        cities_id, 
        companies_id, 
        interest,
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    res.status(201).send({msg:'Contact updated successfully', newContact});
  });

//DELETE CONTACTS 
app.delete('/contacts/:id', authUser, async (req, res) => { 
  let id = req.params.id
  console.log(req)
  try {
      const status =  await Contacts.destroy({
          where: {
             id: id  
          }
      }) 
      if (status == 0) {
          res.status(404).send({msg: `There is not Contact with the id ${id} to be eliminated`})
      } else {
          res.status(200).send({msg: "DELETED"});
      }
  } catch (error) {
      res.status(400).send({msg:'Something happened ' + error});  
  }
});

///////USERS/////////////////

//JWT - Login with token
app.post('/login', validateLogin, (req, res) =>{
    const username = req.body.username;

    const user_id = req.user.id;
    const isAdmin = req.user.isAdmin;
    //consultar bd y validar que existen tanto username como password
    const user = {id: user_id};// Se crea un objeto con id de usuario para generar el token
    const accessToken = generateAccessToken(user);
    res.send({ 
        msg: 'User authenticated',
        token: accessToken,
        isAdmin: isAdmin
    });

})

//GET - Read ALL users.
app.get('/users',authUser, isAdmin, async (req, res) => {
    try {
        const users =  await Users.findAll();
        res.status(200).send({msg:'These are all the users', users});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});


// CREATE Sign up new user (add user)
app.post('/signup', authUser, validateSignup, validateUser, async(req, res) => {

    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    var admin =  false;
    if (req.body.profile == 'true' ) {
      admin =  true
    } 
  
    try {
        const newUser = await Users.create({
            username: username,
            firstname : firstname,
            lastname : lastname, 
            email : email,
            isAdmin: admin,
            password : await bcrypt.hash(password, 5) //password encrypted
        })
        res.status(201).send({msg:'User created successfully', newUser});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
  });
  
  //EDIT USERS 
  app.put("/users/:id", authUser, isAdmin, async (req, res) => {
    
      const { firstname, lastname, email, isAdmin, username} = req.body;
      const password = await bcrypt.hash(req.body.password, 5);
      const idParam = req.params.id;
      const newUser = await Users.update(
        {
            firstname,
            lastname,
            email,
            isAdmin,
            username,
            password
          
        },
        {
          where: {
            id: idParam,
          },
        }
      );
      res.status(201).send({msg:'User updated successfully', newUser});
    });
  
//DELETE USER 
app.delete('/users/:id', authUser, isAdmin, async (req, res) => { 
    let id = req.params.id
    try {
        const status =  await Users.destroy({
            where: {
               id: id  
            }
        }) 
        if (status == 0) {
            res.status(404).send({msg: `There is not User with the id ${id} to be eliminated`})
        } else {
            res.status(200).send({msg: "DELETED"});
        }
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});


/////////////////////// REGIONS

//GET REGIONS
app.get('/regions',authUser, isAdmin, async (req, res) => {
    try {
        const regions =  await Regions.findAll();
        res.status(200).send({msg:'These are all the Regions', regions});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});

//ADD REGIONS (create)
app.post('/regions', authUser, async(req, res) => {

  const name = req.body.name; 

  try {
      const newRegion = await Regions.create({
          name: name
      })
      res.status(201).send({msg:'Region created successfully', newRegion});  
  } catch (error) {
      res.status(400).send({msg:'Something happened ' + error});  
  }
});

//EDIT REGIONS
app.put("/regions/:id", authUser, async (req, res) => {
    const { name, regions_id } = req.body;
    const idParam = req.params.id;
    const newRegion = await Regions.update( 
      {
        name,
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    res.status(201).send({msg:'Region updated successfully', newRegion});
  });

//DELETE REGION 
app.delete('/regions/:id', authUser, isAdmin, async (req, res) => { 
    let id = req.params.id
    try {
        const status =  await Regions.destroy({
            where: {
               id: id  
            }
        }) 
        if (status == 0) {
            res.status(404).send({msg: `There is not region with the id ${id} to be eliminated`})
        } else {
            res.status(200).send({msg: "DELETED"});
        }
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});
///////COUNTRIES

//GET COUNTRIES
app.get('/countries',authUser, isAdmin, async (req, res) => {
    try {
        const countries =  await Countries.findAll();
        res.status(200).send({msg:'These are all the Countries', countries});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});


///ADD COUNTRY (create)
app.post('/countries', authUser, async(req, res) => {

    const { name, region_id } = req.body;

    try {
        
        const newCountry = await Countries.create({
            name,
            region_id,
    
        })
        res.status(201).send({msg:'Country created successfully', newCountry});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
  });

  //EDIT COUNTRIES
  app.put("/countries/:id", async (req, res) => {
    const { name, countries_id } = req.body;
    const idParam = req.params.id;
    const newCountry = await Countries.update(
      {
        name,
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    res.status(201).send({msg:'Country updated successfully', newCountry});
  });

//DELETE Country by ID 
app.delete('/countries/:id', authUser, isAdmin, async (req, res) => { 
    let id = req.params.id
    try {
        const status =  await Countries.destroy({
            where: {
               id: id  
            }
        }) 
        if (status == 0) {
            res.status(404).send({msg: `There is not Country with the id ${id} to be eliminated`})
        } else {
            res.status(200).send({msg: "DELETED"});
        }
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});

//////CITIES

//GET CITIES
app.get('/cities',authUser, isAdmin, async (req, res) => {
    try {
        const cities =  await Cities.findAll();
        res.status(200).send({msg:'These are all the Cities', cities});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});


///ADD CITY (create)
app.post('/cities', authUser, async(req, res) => {

    const { name, countries_id } = req.body;  
    try {
        const newCity = await Cities.create({
            name,
            countries_id,
        })
        res.status(201).send({msg:'City created successfully', newCity});  
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
  });

  //EDIT CITY
  app.put("/cities/:id", async (req, res) => {
    const { name, cities_id } = req.body;
    const idParam = req.params.id;
    const newCity = await Cities.update(
      {
        name,
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    res.status(201).send({msg:'City updated successfully', newCity});
  });
//DELETE CITY by ID 
app.delete('/cities/:id', authUser, isAdmin, async (req, res) => { 
    let id = req.params.id
    try {
        const status =  await Cities.destroy({
            where: {
               id: id  
            }
        }) 
        if (status == 0) {
            res.status(404).send({msg: `There is not City with the id ${id} to be eliminated`})
        } else {
            res.status(200).send({msg: "DELETED"});
        }
    } catch (error) {
        res.status(400).send({msg:'Something happened ' + error});  
    }
});



///////////////////VALIDATE FUNCTIONS/////////////////// 

//Validate singup- valid information to create a new user (mandatory fields and password restriction)

async function validateSignup(req, res, next){
  if (req.body.username == '' || req.body.firstname == '' || req.body.email == '' ||
      req.body.lastname == '' || req.body.isAdmin == '' || !req.body.password || req.body.password == '') { 
          
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

//To verify that user is login (token valid + isn't expired)
function authUser(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //Si el token es valido, la variable user tiene el objeto guardado en el /auth
        const user = jsonwebtoken.verify(token, process.env.SECRET);
        if (user) {
            req.user = user;// El objeto de user se guarda en el request que comparte la funcion
            console.log(req.user)
            return next();
        }
    } catch(err){
        res.status(400).send({msg:'You must login first', error: err});
    }
}

// To verify if user is admin
async function isAdmin (req, res, next) {
    const id = req.user.id;
    const user = await Users.findOne({where: {id: id}});
    
    const isAdmin = user.isAdmin; 

    if (isAdmin == true) { 
        return next();
    } else {
        res.status(400).send({msg:'User is not admin', is_admin: isAdmin});
    }
}

//Permit to acces information

async function validateRole(req, res, next) {
    const id = req.user.id;
    const user = await Users.findOne({where: {id: id}});

    if (user) { 
        const isAdmin = user.is_admin;
        req.is_admin = isAdmin;
        return next();
    } else {
        res.status(400).send({msg:'User does not exist'});
    }
}

//SERVER
app.listen(PORT, () => {
  console.log(`Server started to listen in port ${PORT}`);
});