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
};

// Initialise on Document Ready
ready(init);
