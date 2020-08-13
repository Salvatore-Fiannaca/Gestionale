
// list form
const regForm = document.querySelector('#regForm')

//send data to db
regForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputName = document.querySelector('#username')
    //const lastName = document.querySelector('#lastName')
    const inputEmail = document.querySelector('#email')
    const inputPassword = document.querySelector('#password')
    //const repeatPassword = document.querySelector('#repeatPassword')

    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: inputName.value,
        email: inputEmail.value,
        password: inputPassword.value
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      alert('Account creato con successo!')
      return window.location.href='/login'
    })
    .catch(error => console.log('ERROR'))
 })
