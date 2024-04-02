let menu = document.querySelector('.ri-apps-line')
let navbar = document.querySelector('.navbar')

menu.onclick = () => {
    menu.classList.toggle('.ri-close-large-fill')
    navbar.classList.toggle('open')
}


