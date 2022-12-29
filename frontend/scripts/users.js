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

/////LOAD REGION FROM DB
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
          const email = user.email;
          const name = `${user.firstname} ${user.lastname}`
          const profile = user.isAdmin ? 'Admin' : 'Basic';
          const checkedAdm = user.isAdmin ? 'checked' : '';
          const isActive = user.isActive ? 'Yes' : 'No'; //para contact ocultar o mostrar hidden  cuarto td con boton edit
          const checkedAct = user.isActive ? 'checked' : ''; //esto, y los td respectivos, que estan hidden, son para mostrar cuando se de click en edit
          usersTableHTML += `<tr>
                                <th scope="row"><input class="form-check-input" type="checkbox"></th>
                                <td>${id}</td>
                                <td>${name}</td>
                                <td class="hidden"><input type="text" class="form-control" value="${name}"></td> 
                                <td><span class="ms-1">${email}</span></td>
                                <td>${profile}</td>
                                <td class="hidden"><input ${checkedAdm}  class="form-check-input" type="checkbox" value="" id="profile"></td>
                                <td>${isActive}</td>
                                <td class="hidden"><input ${checkedAct}  class="form-check-input" type="checkbox" value="" id="profile"></td>
                                <td class="text-end"><button>Edit</button><button>Delete</button></td>
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

