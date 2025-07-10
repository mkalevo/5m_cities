let currentOpenModal = ''

const openModal = ( modal ) => {
    document.getElementById( modal ).style.display = "block"

    currentOpenModal = modal

    window.addEventListener('click', closeModalOnClickOutside)
}

const closeModal = ( modal ) => {
    document.getElementById(modal).style.display = "none"

    currentOpenModal = ''

    window.removeEventListener('click', closeModalOnClickOutside)
}

const closeModalOnClickOutside = (event) => {
    const selectedModal = document.getElementById(currentOpenModal)
    if (event.target === selectedModal){
        closeModal(currentOpenModal)
    }
}