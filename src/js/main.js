/*------------------*\
     MAIN SCRIPTS
\*------------------*/

// Ready
function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

// Init
const init = async () => {
  // Copyright Year
  const copyrightYear = document.getElementById("copyrightYear");
  if (copyrightYear) {
    const year = new Date().getFullYear();
    copyrightYear.textContent = year;
  }
  // Mobile Nav
  const navBtn = document.getElementById("navBtn");
  const navMenu = document.getElementById("navMenu");
  if (navBtn && navMenu) {
    navMenu.classList.toggle("is_collapsed");
    navBtn.addEventListener("click", (event) => {
      navMenu.classList.toggle("is_collapsed");
    });
  }
};

// Initialise on Document Ready
ready(init);
