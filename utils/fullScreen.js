const requestFullScreen = () => {
    if (document.fullscreenElement){
        document
        .exitFullscreen()
        .then(() => console.log("Document exited from fullscreen mode"))
        .catch((err) => console.error(err)) 
    } else {
        document.documentElement.requestFullscreen()
    }
}


document.addEventListener('fullscreenchange', (event) => {
    const fullscreenButton = document.getElementById('fullscreen')
    const fullscreenIcon = document.getElementById('fullscreen-icon')
    if(document.fullscreenElement){
        fullscreenButton.classList.add('active')
        fullscreenIcon.src = './assets/icons/exit_full_screen.png'
    } else {
        fullscreenButton.classList.remove('active')
        fullscreenIcon.src = './assets/icons/full_screen.png'

    }
})