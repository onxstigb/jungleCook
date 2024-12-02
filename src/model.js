import Swal from "sweetalert2"; // Import SweetAlert2
import * as $ from "jquery";

// Function to change page
export function changePage(pageName) {
  console.log("Requested pageName:", pageName);

  // Default to "home" if no pageName is provided
  if (!pageName) {
    pageName = "home";
  }

  console.log(`Loading ${pageName}.html`);

  // Attempt to load the requested page
  $.get(`pages/${pageName}.html`, (data) => {
    console.log(`Successfully loaded: ${pageName}.html`);
    $("#app").html(data);
  }).fail((error) => {
    console.error(`Error loading page ${pageName}:`, error);

    // Show SweetAlert2 error message when page fails to load
    Swal.fire({
      title: "Error loading page",
      text: `There was an issue loading the page: ${error.statusText}`,
      icon: "error",
      confirmButtonText: "Ok",
      showCancelButton: false,
    }).then(() => {
      console.log("Loading fallback page: home.html");

      // Fallback: attempt to load home page
      $.get("pages/home.html", (data) => {
        console.log("Successfully loaded fallback home.html");
        $("#app").html(data);
      }).fail((fallbackError) => {
        console.error("Error loading fallback page home:", fallbackError);

        // If both attempts fail, display an error message
        $("#app").html("<h1>Error loading content</h1>");
      });
    });
  });
}

// Function to handle user sign up
export function signUserUp(fn, ln, email, password) {
  console.log("Registering user:", fn, ln, email, password);

  // Send POST request to the server to register the user
  $.post("/api/register", { fn, ln, email, password })
    .done((response) => {
      console.log("User successfully registered:", response);
    })
    .fail((error) => {
      console.error("Error registering user:", error);

      // Show an alert if registration fails
      Swal.fire({
        title: "Registration Failed",
        text: `There was an issue registering the user: ${error.statusText}`,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    });
}
