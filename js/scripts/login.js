document.querySelector('#login-form').addEventListener('submit', async (ev)=>{
    ev.preventDefault();

    const username = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const headers = new Headers();
    headers.append('Content-Type',"application/json");

    //connection with backend (server.js)
    try{
        const responseLogin = await fetch('http://localhost:3000/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers
        });

        const responseObject = await responseLogin.json();

        if(responseLogin.status != 200){
            alert(responseObject.error);
        } else {

            localStorage.setItem('token', responseObject.token);
            localStorage.setItem('isAdmin', responseObject.isAdmin);
            location.href = 'contacts.html';  
        }
    } catch (error){
        alert("something is wrong, try again later");
        console.error(error);
    }
})