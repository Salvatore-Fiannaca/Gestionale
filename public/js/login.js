
// list form
const loginForm = document.querySelector('#loginForm')

//send data to db
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputEmail = document.querySelector('#inputEmail')
    const inputPassword = document.querySelector('#inputPassword')

    fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: inputEmail.value,
        password: inputPassword.value
      })
    }).then(res => {
      return res.json()
    }).then(data => {
      alert(`Benvenuto ${data.user.name}`)
      return window.location.href='/'
    })
    .catch(error => console.log('ERROR'))
 })
