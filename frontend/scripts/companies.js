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
////////////////SELECT CITIES INSIDE MODAL
//CITIES SELECT
//functions on load

loadCitiesSelect()

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
      cities.forEach(cit => {
        const name = cit.name;
        const id = cit.id;
        citiesSelectHTML += `<option value="${id}" >${name}</option>`
                          
      });
      const element = document.getElementById('select-country-cities');
      element.innerHTML = element.innerHTML + citiesSelectHTML;

      const element2 = document.getElementById('select-country-cities-update');
      element2.innerHTML = element2.innerHTML + citiesSelectHTML;
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}


/////LOAD COMPANIES FROM DB
async function loadCompanieTable() {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
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
      var companiesTableHTML = ``;

      companies.forEach(companies => {
        const id = companies.id;
        const name = companies.name;
        const address = companies.address;
        const email = companies.email;
        const phone_number = companies.phone_number;
        const city = companies.city.name;
        const city_id = companies.city.id;


        companiesTableHTML += `<tr>
                              <th scope="row"><input class="form-check-input" type="checkbox"></th>
                              <td>${id}</td>
                              <td>${name}</td>
                              <td>${address}</td>
                              <td><span class="ms-1">${email}</span></td>
                              <td>${phone_number}</td>
                              <td>${city}</td>

                              <td class="text-end">
                              <button class="btn" id='edit-companie-${id}' onclick="openEditCompaniesModal('${id}','${name}','${address}','${email}', '${phone_number}', '${city_id}');">Edit</button>                                  
                              <button class="btn" onclick="deleteCompany(${id})">Delete</button></td>
                          </tr>`;
                          
      });
      const element = document.getElementById('companies-table-body'); //GUARDO EN DIV GENERAL QUE ESTA EN HTML ORIGINAL.
      element.innerHTML = companiesTableHTML;

    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

loadCompanieTable() ///LLAMADO PARA CONSTRUIR TABLA


async function deleteCompany(id) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
      const response = await fetch(`http://localhost:3000/companies/${id}`, {
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


async function updateCompany() {
   
  const id = document.getElementById('id-update').value;
  const name =document.getElementById('name-update').value;
  const address =document.getElementById('address-update').value;
  const email =document.getElementById('email-update').value;
  const cities_id =document.getElementById('select-country-cities-update').value;
  const phone_number =document.getElementById('phone-update').value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/companies/'+ id, {
          method: 'PUT',
          body: JSON.stringify({name, address, email, cities_id, phone_number}),
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

function openEditCompaniesModal(id,name, address, email, phone_number, city){

  document.getElementById('id-update').value = id;
  document.getElementById('name-update').value = name;
  document.getElementById('address-update').value = address;
  document.getElementById('email-update').value = email;
  document.getElementById('phone-update').value = phone_number;
  document.getElementById('select-country-cities-update').value = city;
  
  modal2.style.display = "block";

}



////////////////MODALS
////NEW COMPANY MODAL

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementById("close");

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
//UPDATE COMPANY MODAL
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


//Create New Company
document.querySelector('#company-name-btn').addEventListener('click', async (ev)=>{
  ev.preventDefault();


  const inputSelectCity = document.getElementById('select-country-cities');
  const cities_id = inputSelectCity.value;

  const inputCompanieName = document.getElementById('name');
  const inputCompanieAddress = document.getElementById('address');
  const inputCompanieEmail = document.getElementById('email');
  const inputCompanieNumb = document.getElementById('phone');

  const name = inputCompanieName.value;
  const address = inputCompanieAddress.value;
  const email = inputCompanieEmail.value;
  const phone_number = inputCompanieNumb.value;
  //EN CONTACTS Y COMPANY DEBERIA AGREGAR ACA EL RESTO DE LOS CAMPOS, EMAIL ETC

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/companies', {
          method: 'POST',
          body: JSON.stringify({name, address, email, phone_number, cities_id}),
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
