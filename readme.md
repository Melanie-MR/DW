#  DW - Data Warehouse 
This is a web application that allows a Marketing company to manage all the contacts of its clients for its campaigns.

## Technologies:
*HTML
*CSS
*Bootstrap
* JavaScript
* NodeJS
* Express
* Sequelize
* MySQL
* Bcryptjs
* Jsonwebtoken
* Postman for testing

## How to install?

*PLEASE READ UNTIL THE BOTTOM TO INSTALL IT PROPERLY*

You can clone the repository from here. Go to the CODE button in the right and click on download zip.
Once that you have the files, open it in your favorite editor.

## Dependencies:
In your terminal, install the necessary dependencies running the command:

*npm install*

then, execute the following command: 

*npm run dev* The server will be running in localhost:3000

**WARNING:
You must modify config/connection.js to make it match with your enviroment. Take in account that in the file .env you can adjust the variables used in the file config/connection.js. For example: DB_NAME, DB_HOST, DB_PORT...**

## Data Base:

Create a data base named dw and use the dw.sql file to import the information into your Database client. It will provide the entire structure and some examples to add products and users. I recommend using Postman to test the endpoints. You can find the postman's collection as DW.postman_collection.json.

IF YOU HAVE BOTH DB CREATED AND THE CONFIG ADJUSTMENTS DONE IN YOUR EDITOR, GO AHEAD WITH THE NEXT STEP:

You have all set! Try the endpoints in your Postman collection and have fun! :)
