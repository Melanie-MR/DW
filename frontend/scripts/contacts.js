// check admin user
//Show hide functions
function showAdmin() {
    const isAdmin = localStorage.getItem('isAdmin');
    const usersTab = document.getElementById('usersHide');
    if (isAdmin=='true'){
      usersTab.classList.remove('hidden');
    }
}
showAdmin();
loadCompaniesSelect();
loadCitiesSelect();

//LOAD COMPANIES SELECT
//COMPANIES SELECT
async function loadCompaniesSelect(){
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  try{
    const response = await fetch('http://localhost:3000/companies', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const companies = responseObject.companies;
      var companiesSelectHTML = ``;
      companies.forEach(reg => {
        const name = reg.name;
        const id = reg.id;
        companiesSelectHTML += `<option value="${id}" >${name}</option>`
                          
      });
      const element = document.getElementById('comp-name');
      element.innerHTML = element.innerHTML + companiesSelectHTML;
      
      const element2 = document.getElementById('company-update');
      element2.innerHTML = element2.innerHTML + companiesSelectHTML;
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

//LOAD CITIES SELECT
//CITIES SELECT
async function loadCitiesSelect(){
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  try{
    const response = await fetch('http://localhost:3000/cities', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const cities = responseObject.cities;
      var citiesSelectHTML = ``;
      cities.forEach(reg => {
        const name = reg.name;
        const id = reg.id;
        citiesSelectHTML += `<option value="${id}" >${name}</option>`
                          
      });
      const element = document.getElementById('city');
      element.innerHTML = element.innerHTML + citiesSelectHTML;

      const element2 = document.getElementById('select-country-cities-update');
      element2.innerHTML = element2.innerHTML + citiesSelectHTML;
      
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

//Create New Contact
document.querySelector('#contact-name-btn').addEventListener('click', async (ev)=>{
  ev.preventDefault();


  /* const inputSelectCity = document.getElementById('select-country-cities');
  const cities_id = inputSelectCity.value; */
  //HAY QUE AGREGAR DESPLEGABLE DE CITIES, REGION, COUNTRY, y arreglar db.por eso falla el crear

  
  const inputFirstName = document.getElementById('first-name');
  const inputLastName = document.getElementById('last-name');
  const inputPosition= document.getElementById('position');
  const inputEmail = document.getElementById('email');
  const inputSelectCompanieId = document.getElementById('comp-name');
  const inputAddress = document.getElementById('address');
  const inputSelectInterest = document.getElementById('interest');
  const inputSelectCity = document.getElementById('city');



  const firstname = inputFirstName.value;
  const lastname = inputLastName.value;
  const email = inputEmail.value;
  const address = inputAddress.value;
  const position = inputPosition.value;
  const cities_id = inputSelectCity.value;
  const companies_id = inputSelectCompanieId.value;
  const interest = inputSelectInterest.value;

  //EN CONTACTS Y COMPANY DEBERIA AGREGAR ACA EL RESTO DE LOS CAMPOS, EMAIL ETC

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/contacts', {
          method: 'POST',
          body: JSON.stringify({firstname, lastname, email, address, position, cities_id, companies_id, interest}),
          headers
      });

      const responseObject = await response.json();

      if(!response.ok){
          alert(responseObject.msg);
      } else {
          alert(responseObject.msg);
          location.reload()
      }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }
})


/////LOAD CONTACTS FROM DB
async function loadContactsTable() {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch('http://localhost:3000/contacts', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
      const contacts = responseObject.contacts;
      var contactsTableHTML = ``;

      contacts.forEach(contacts => {
        const id = contacts.id;
        const contact = `${contacts.firstname} ${contacts.lastname}`;
        const city = contacts.city.name; //agregar country and region
        const city_id = contacts.cities_id; //agregar country and region
        const company = contacts.company.name; ///falta mostrar nombre en vez de ID
        const company_id = contacts.companies_id; ///falta mostrar nombre en vez de ID
        const position = contacts.position;
        const interest = contacts.interest;

        contactsTableHTML += `<tr>
                              <th scope="row"><input class="form-check-input" type="checkbox"></th>
                              <td>${id}</td>
                              <td>${contact}</td>
                              <td>${city}</td>
                              <td>${company}</td>
                              <td>${position}</td>
                              <td>${interest}</td>

                              <td class="text-end">
                                  <button class="btn" id='edit-contacts-${id}' onclick="openEditContactsModal('${id}','${contacts.firstname}','${contacts.lastname}','${contacts.address}','${contacts.email}','${company_id}', '${city_id}', '${position}', '${interest}');">Edit</button>                                  
                                  <button class="btn" onclick="deleteContact(${id})">Delete</button></td>
                          </tr>`;
                          
      });
      const element = document.getElementById('contacts-table-body'); //GUARDO EN DIV GENERAL QUE ESTA EN HTML ORIGINAL.
      element.innerHTML = contactsTableHTML;

    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

loadContactsTable() ///LLAMADO PARA CONSTRUIR TABLA

///DELETE
async function deleteContact(id) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
      const response = await fetch(`http://localhost:3000/contacts/${id}`, {
          method: 'DELETE',
          headers
      });

      const responseObject = await response.json();

      if(!response.ok){
          alert(responseObject.msg);
      } else {
          location.reload();
      }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }
}

async function updateContact() {
   
  const id = document.getElementById('id-update').value;
  const firstname =document.getElementById('first-name-update').value;
  const lastname =document.getElementById('last-name-update').value;
  const address =document.getElementById('address-update').value;
  const email =document.getElementById('email-update').value;
  const companies_id =document.getElementById('company-update').value;
  const cities_id =document.getElementById('select-country-cities-update').value;
  const position =document.getElementById('position-update').value;
  const interest =document.getElementById('interest-update').value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/contacts/'+ id, {
          method: 'PUT',
          body: JSON.stringify({firstname, lastname, address, email, companies_id, cities_id,companies_id, position, interest}),
          headers
      });

      const responseObject = await response.json();

      if(!response.ok){
          alert(responseObject.msg);
      } else {
          alert(responseObject.msg);
          location.reload()
      }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }
}

function openEditContactsModal(id, firstname, lastname, address, email, company_id, cities_id, position, interest){

  document.getElementById('id-update').value = id;
  document.getElementById('first-name-update').value = firstname;
  document.getElementById('last-name-update').value = lastname;
  document.getElementById('email-update').value = email;
  document.getElementById('address-update').value = address;
  document.getElementById('company-update').value = company_id;
  document.getElementById('position-update').value = position;
  document.getElementById('interest-update').value = interest;
  document.getElementById('select-country-cities-update').value = cities_id;


  modal2.style.display = "block";

}




///////////////MODAL

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//MODALE CREATE NEW CONTACT

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//UPDATE CONTACT MODAL
// Get the modal
var modal2 = document.getElementById("myModal2");

// Get the <span> element that closes the modal
var span2 = document.getElementById("close2");


// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}