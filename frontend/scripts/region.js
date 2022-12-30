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


//Show hide functions
function show(id) {
  document.getElementById(id).classList.remove('hidden')
}

function hide(id) {
  document.getElementById(id).classList.add('hidden')
}

///////////////////////////////////FRONT//////////////////////////////////////////

//TREE LIST
//Add click event to all children
function addEvents() {
    var toggler = document.getElementsByClassName("caret");
    var i;
    
    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function() {
        const childrenNodes = this.parentElement.querySelectorAll(':scope > .nested');
        childrenNodes.forEach(child => {
          child.classList.toggle("active")
        });
        this.classList.toggle("caret-down");
      });
    }
}
//functions on load
addEvents();
loadRegionsSelect();
loadCountriesSelect()

document.querySelector('#load-regions').onclick = function(ev) {
  ev.preventDefault();
  loadRegions();

}

////////////////SELECT REGIONS AND COUNTRIES INSIDE MODAL

//REGIONS SELECT
async function loadRegionsSelect(){
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch('http://localhost:3000/regions', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const regions = responseObject.regions;
      var regionsSelectHTML = ``;
      regions.forEach(reg => {
        const name = reg.name;
        const id = reg.id;
        regionsSelectHTML += `<option value="${id}" >${name}</option>`
                          
      });
      const element = document.getElementById('select-regions-country');
      element.innerHTML = element.innerHTML + regionsSelectHTML;
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

//COUNTRIES SELECT
async function loadCountriesSelect(){
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  try{
    const response = await fetch('http://localhost:3000/countries', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const countries = responseObject.countries;
      var countriesSelectHTML = ``;
      countries.forEach(reg => {
        const name = reg.name;
        const id = reg.id;
        countriesSelectHTML += `<option value="${id}" >${name}</option>`
                          
      });
      const element = document.getElementById('select-country-cities');
      element.innerHTML = element.innerHTML + countriesSelectHTML;
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}


/////LOAD REGION FROM DB
async function loadRegions() {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch('http://localhost:3000/regions', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const regions = responseObject.regions;
      var regionsHTML = ``;
      regions.forEach(reg => {
        const name = reg.name;
        const id = reg.id;
        regionsHTML += `<ul class="nested list-style active">
                          <li id="reg-${id}">
                            <span class="caret style-tree" id="country-btn-${id}">${name}</span>
                            <div class="btn-container">
                              <input value="${name}" class="hidden" type="input" autocomplete="off" name="region-name" id="region-name-${id}">
                              <button class="btn hidden" id='update-reg-${id}' onclick= "updateRegion(${id})">Update</button>
                              <button type="button" class="btn" id='edit-reg-${id}' onclick="show('region-name-${id}');hide('edit-reg-${id}');show('update-reg-${id}');">Edit</button>
                              <button class="btn" onclick= "deleteRegion(${id})">Delete</button>
                            </div>
                          </li>
                        </ul>`
                          
      });
      const regElement = document.getElementById('myRegions');
      regElement.innerHTML = regElement.innerHTML + regionsHTML;
      addEvents();
      // Para todas las regiones, agrega el evento de click para cargar countries
      regions.forEach(reg => {
        const id = reg.id;
        document.querySelector('#country-btn-' + id).onclick = function(ev) {
          ev.preventDefault();
          loadCountries(id)
        }
      })

    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

///LOAD COUNTRIES FROM DB
async function loadCountries(idRegion) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch('http://localhost:3000/countries', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const countries = responseObject.countries.filter(c => c.region_id == idRegion);
      var countriesHTML = ``;
      countries.forEach(coun => {
        const name = coun.name;
        const id = coun.id;
        countriesHTML += `<ul class="nested list-style active">
                            <li>
                              <span class="caret style-tree">Country</span>
                              <ul class="nested list-style">
                              <li id="coun-${id}">
                                <span class="caret style-tree" id="city-btn-${id}">${name}</span>
                                <div class="btn-container">
                                  <input value="${name}" class="hidden" type="input" autocomplete="off" name="coun-name" id="coun-name-${id}">
                                  <button class="btn hidden" id='update-coun-${id}' onclick= "updateCoun(${id})">Update</button>
                                  <button type="button" class="btn" id='edit-coun-${id}' onclick="show('coun-name-${id}');hide('edit-coun-${id}');show('update-coun-${id}');">Edit</button>
                                  <button class="btn" onclick= "deleteRegion(${id})">Delete</button>
                                </div>                               
                              </li>
                            </ul>
                          </li>
                        </ul>`
      });
      const counElement = document.getElementById(`reg-${idRegion}`);
      counElement.innerHTML = counElement.innerHTML + countriesHTML;
      addEvents();

// Para todos los countries, agrega el evento de click para cargar cities
      countries.forEach(coun => {
        const id = coun.id;
        document.querySelector('#city-btn-' + id).onclick = function(ev) {
          ev.preventDefault();
          loadCities(id)
        }
      })
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}


///LOAD CITIES FROM DB 
async function loadCities(idCountries) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch('http://localhost:3000/cities', {
        method: 'GET',
        headers
    });

    const responseObject = await response.json();

    if(!response.ok){
        alert(responseObject.msg);
    } else {
        
      const cities = responseObject.cities.filter(ci => ci.countries_id == idCountries);
      var citiesHTML = ``;
      cities.forEach(cit => {
        const name = cit.name;
        const id = cit.id;
        citiesHTML += `<ul class="nested list-style active">
                        <li>
                          <span class="caret style-tree">City</span>
                          <ul class="nested list-style">
                            <li id="cit-${id}">
                              <span  class="style-tree">${name}</span>
                              <div class="btn-container">
                                <input value="${name}" class="hidden" type="input" autocomplete="off" name="city-name" id="city-name-${id}">
                                <button class="btn hidden" id='update-cit-${id}' onclick= "updateCity(${id})">Update</button>
                                <button type="button" class="btn" id='edit-cit-${id}' onclick="show('city-name-${id}');hide('edit-cit-${id}');show('update-cit-${id}');">Edit</button>
                                <button class="btn" onclick= "deleteRegion(${id})">Delete</button>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>`               
                          
      });
      const citElement = document.getElementById(`coun-${idCountries}`);
      citElement.innerHTML = citElement.innerHTML + citiesHTML;
      addEvents();
    }
  } catch (error){
      alert("something is wrong, try again later");
      console.error(error);
  }

}

//DELETE REGION BTN (NO FUNCIONA, ERROR: Something happened SequelizeForeignKeyConstraintError: Cannot delete or update a parent row: a foreign key constraint fails (`dw`.`countries`, CONSTRAINT `fk_countries_regions` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)")
async function deleteRegion(id) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch(`http://localhost:3000/regions/${id}`, {
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

//DELETE COUNTRY BTN 
/* async function deleteCountry(id) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');

  //connection with backend (server.js)
  try{
    const response = await fetch(`http://localhost:3000/countries/${id}`, {
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

} */


//////////UPDATES REGION, COUNTRY, CITY BTN

//UPDATE REGION
async function updateRegion(id) {
   
  const inputRegionName = document.getElementById('region-name-' + id);
  const name = inputRegionName.value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/regions/'+ id, {
          method: 'PUT',
          body: JSON.stringify({name}),
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

//UPDATE COUNTRY
 async function updateCoun(id) {
   
  const inputCounName = document.getElementById('coun-name-' + id);
  const name = inputCounName.value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/countries/'+ id, {
          method: 'PUT',
          body: JSON.stringify({name}),
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

//UPDATE CITY
async function updateCity(id) {
   
  const inputCityName = document.getElementById('city-name-' + id);
  const name = inputCityName.value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/cities/'+ id, {
          method: 'PUT',
          body: JSON.stringify({name}),
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


//CREATE NEW REGION, COUNTRY, CITY

//Create New region
document.querySelector('#region-name-btn').addEventListener('click', async (ev)=>{
  ev.preventDefault();

  const inputRegionName = document.getElementById('region-name');
  const name = inputRegionName.value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/regions', {
          method: 'POST',
          body: JSON.stringify({name}),
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

//Create New country
document.querySelector('#coun-name-btn').addEventListener('click', async (ev)=>{
  ev.preventDefault();


  const inputSelectRegCoun = document.getElementById('select-regions-country');
  const region_id = inputSelectRegCoun.value;

  const inputCountryName = document.getElementById('coun-name');
  const name = inputCountryName.value;

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/countries', {
          method: 'POST',
          body: JSON.stringify({name, region_id}),
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



//Create New city
document.querySelector('#city-name-btn').addEventListener('click', async (ev)=>{
  ev.preventDefault();


  const inputSelectCoun = document.getElementById('select-country-cities');
  const countries_id = inputSelectCoun.value;

  const inputCityName = document.getElementById('city-name');
  const name = inputCityName.value;
  //EN CONTACTS Y COMPANY DEBERIA AGREGAR ACA EL RESTO DE LOS CAMPOS, EMAIL ETC

  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Access-Control-Allow-Origin', '*');


  //connection with backend (server.js)
  try{
      const response = await fetch('http://localhost:3000/cities', {
          method: 'POST',
          body: JSON.stringify({name, countries_id}),
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


///////////////////////////MODALS REGION COUNTRY CITY

//////////MODAL region 

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


//////////MODAL country 

// Get the modal
var modal2 = document.getElementById("myModal2");

// Get the button that opens the modal
var btn2 = document.getElementById("myBtn2");

// Get the <span> element that closes the modal
var span2 = document.getElementById("close2");

// When the user clicks on the button, open the modal
btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal2.style.display = "none";
  }
}


//////////MODAL city 

// Get the modal
var modal3 = document.getElementById("myModal3");

// Get the button that opens the modal
var btn3 = document.getElementById("myBtn3");

// Get the <span> element that closes the modal
var span3 = document.getElementById("close3");

// When the user clicks on the button, open the modal
btn3.onclick = function() {
  modal3.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span3.onclick = function() {
  modal3.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal3.style.display = "none";
  }
}