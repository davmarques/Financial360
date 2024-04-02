let menu = document.querySelector('.ri-apps-line')
let navbar = document.querySelector('.navbar')

menu.onclick = () => {
    menu.classList.toggle('.ri-close-large-fill')
    navbar.classList.toggle('open')
}


var scrollEventHandler = function()
{
  window.scroll(0, window.pageYOffset)
}

window.addEventListener("scroll", scrollEventHandler, false);
