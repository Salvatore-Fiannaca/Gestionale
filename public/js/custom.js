const logout = () => {
    fetch('http://localhost:3000/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(data => {
        alert("Bye")
        window.location.href='/login'
    })
    .catch(error => console.log('ERROR'))
}