console.log('Client side javascript file is loaded!')

const clientForm = document.querySelector('#clientForm')

const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

clientForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const firstName = document.querySelector('#firstName').value
    const lastName = document.querySelector('#lastName').value

    messageOne.textContent  = 'Loading...'
    messageTwo.textContent = ''
    
    fetch('http://localhost:3000/tasks').then((response) => {
    response.json().then((data) => {
        if (data.error) {
          messageOne.textContent = data.error
        } else {
            messageOne.textContent = "Cliente registrato correttamente"
          //messageOne.textContent = data.body
          //messageTwo.textContent = data
        }
        }
    )}
    )
  
})