const passwordInput = document.querySelector('#password')
const icon = document.querySelector('.icon')

if (icon) {
    icon.addEventListener('click', (e) => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
})
}
