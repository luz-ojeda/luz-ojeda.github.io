const navlinks = document.querySelectorAll(".navlink");
const navbar = document.getElementById("navbar");
const hamburgerButton = document.getElementById("hamburger-button");

if (navlinks && navlinks.length > 0) {
	navlinks.forEach(element => {
		element.addEventListener("click", () => {
			document.body.style.overflowY = "visible";
			if (navbar.classList.contains("slide")) {
				navbar.classList.remove("slide");
			}
			hamburgerButton.classList.toggle("close");
		});
	});
}
