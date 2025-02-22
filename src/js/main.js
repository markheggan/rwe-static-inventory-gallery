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
const init = async () => {};

// Initialise on Document Ready
ready(init);
