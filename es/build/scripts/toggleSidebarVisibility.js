const sidebar = document.querySelector("#sidebar-mobile")
const hamburgerButton = document.getElementById("hamburger-menu")

hamburgerButton.addEventListener("click", () => {
    sidebar.classList.toggle("show")
})