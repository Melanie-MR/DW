// check admin user
//Show hide functions
function showAdmin() {
    const isAdmin = localStorage.getItem('isAdmin');
    const usersTab = document.getElementById('usersHide');
    if (isAdmin=='true'){
      usersTab.classList.remove('hidden');
    } else {
        location.href = 'index.html';  
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

//CREATE USER FORM

const inputFirstName = document.getElementById('first-name');
const inputLastName = document.getElementById('last-name');
const inputEmail = document.getElementById('email');
const inputProfile = document.getElementById('profile');
const inputUsername = document.getElementById('username');
const inputPassword = document.getElementById('password');
const inputRepPassword = document.getElementById('repeat-password');
const submitBtn = document.getElementById('submit-btn');

document.querySelector('#create-form').addEventListener('submit', async (ev)=>{
    ev.preventDefault();

    const firstname = inputFirstName.value;
    const lastname = inputLastName.value;
    const email = inputEmail.value;
    const profile = inputProfile.checked;
    const username = inputUsername.value;
    const password = inputPassword.value;
    const passwordRepeat = inputRepPassword.value;

    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Content-Type',"application/json");
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Access-Control-Allow-Origin', '*');


    //connection with backend (server.js)
    try{
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            body: JSON.stringify({firstname, lastname, email, profile, username, password}),
            headers
        });

        const responseObject = await response.json();

        if(!response.ok){
            alert(responseObject.msg);
        } else {
            alert(responseObject.msg);
        }
    } catch (error){
        alert("something is wrong, try again later");
        console.error(error);
    }
})

/////LOAD USERS FROM DB
async function loadUsersTable() {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Content-Type',"application/json");
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Access-Control-Allow-Origin', '*');
  
    //connection with backend (server.js)
    try{
      const response = await fetch('http://localhost:3000/users', {
          method: 'GET',
          headers
      });
  
      const responseObject = await response.json();
  
      if(!response.ok){
          alert(responseObject.msg);
      } else {
        const users = responseObject.users;
        var usersTableHTML = ``;

        users.forEach(user => {
          const id = user.id;
          const name = `${user.firstname} ${user.lastname}`
          const email = user.email;
          const profile = user.isAdmin ? 'Admin' : 'Basic';
          const checkedAdm = user.isAdmin ? 'checked' : '';
          usersTableHTML += `<tr>
                                <td>${id}</td>
                                <td>${name}</td>
                                <td><span class="ms-1">${email}</span></td>
                                <td>${profile}</td>
                                <td class="text-end">
                                    <button class="btn" id='edit-user-${id}' onclick="openEditUserModal('${id}','${user.firstname}','${user.lastname}','${email}', '${user.isAdmin}', '${user.username}');">Edit</button>
                                    <button class="btn" onclick="deleteUser(${id})">Delete</button></td>


                            </tr>`;
                            
        });
        const element = document.getElementById('users-table-body'); //GUARDO EN DIV GENERAL QUE ESTA EN HTML ORIGINAL.
        element.innerHTML = usersTableHTML;

      }
    } catch (error){
        alert("something is wrong, try again later");
        console.error(error);
    }
  
  }

loadUsersTable() ///LLAMADO PARA CONSTRUIR TABLA

//UPDATE USER NO ANDA EL BOTON 
async function updateUser() {
   
    const id = document.getElementById('id-update').value;
    const firstname = document.getElementById('first-name-update').value;
    const lastname = document.getElementById('last-name-update').value;
    const email = document.getElementById('email-update').value;
    const profile = document.getElementById('profile-update').checked;
    const username = document.getElementById('username-update').value;
    const password = document.getElementById('password-update').value;
    const passwordRepeat = document.getElementById('rep-password-update').value;


    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Content-Type',"application/json");
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Access-Control-Allow-Origin', '*');
  
  
    //connection with backend (server.js)
    try{
        const response = await fetch('http://localhost:3000/users/'+ id, {
            method: 'PUT',
            body: JSON.stringify({firstname, lastname, email, profile, username, password}),
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

async function deleteUser(id) {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Content-Type',"application/json");
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Access-Control-Allow-Origin', '*');

    //connection with backend (server.js)
    try{
        const response = await fetch(`http://localhost:3000/users/${id}`, {
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

function openEditUserModal(id,firstname, lastname, email, isAdmin, username){

    document.getElementById('id-update').value = id;
    document.getElementById('first-name-update').value = firstname;
    document.getElementById('last-name-update').value = lastname;
    document.getElementById('email-update').value = email;
    document.getElementById('profile-update').checked = isAdmin;
    document.getElementById('username-update').value = username;
    
    modal.style.display = "block";

}

// Get the modal
var modal = document.getElementById("myModal");


// Get the <span> element that closes the modal
var span = document.getElementById("close");

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