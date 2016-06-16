var authDrawerIsOpen = false; // This is the state of the auth drawer.
function openAuth(action){ // Open the auth drawer.
  if(authDrawerIsOpen) return; // If the drawer is open don't do anything.
  var other = action === "signin" ? "signup" : "signin"; // "Other" means the element that wasn't clicked.
  el(".close")[0].classList.add("show"); // Show the close button.
  el(".auth")[0].classList.add("expand"); // Show the inputs.
  el("." + action)[0].classList.add("w200"); // Expand the action you clicked.
  el("." + other)[0].classList.add("hide"); // Hide the other action.
  el(".auth")[0].setAttribute("action", "/users/" + action); // Set action on input form to whatever was clicked.
  authDrawerIsOpen = action; // Set state to whatever you clicked. (this is important for closing the drawer)
}

function closeAuth(){ // Close the auth drawer.
  if(!authDrawerIsOpen) return; // If the drawer is closed don't do anything.
  var action = authDrawerIsOpen, // The action is whatever the current state is.
    other = action === "signin" ? "signup" : "signin"; // "Other" is the other action.
  el(".close")[0].classList.remove("show"); // Hide the close button.
  el(".auth")[0].classList.remove("expand"); // Hide the inputs.
  el("." + action)[0].classList.remove("w200"); // Make the action smaller.
  el("." + other)[0].classList.remove("hide"); // Show the other action.
  authDrawerIsOpen = false; // Set drawer state to false.
}
