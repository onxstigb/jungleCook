import * as $ from "jquery";
import { changePage } from "../src/model/model.js";
import { signUserUp } from "../src/model/model.js";

// Initialize event listeners
function initListeners() {
  // Handle navigation clicks
  $("nav a").on("click", function (e) {
    e.preventDefault(); // Prevent default link behavior
    let pageID = $(this).attr("id");
    console.log("Navigating to page:", pageID);

    // Change the page based on the ID
    changePage(pageID);
  });

  $("#submit").on("click", () => {
    const firstName = $("#fName").val();
    const lastName = $("#lName").val();
    const email = $("#email").val();
    const password = $("#password").val();
    signUserUp(firstName, lastName, email, password);

    console.log("Form submitted with:", {
      firstName,
      lastName,
      email,
      password,
    });
  });
}

// JavaScript to toggle the navigation menu
document.getElementById("hamburger").addEventListener("click", function () {
  // Toggle the 'active' class on the navbar
  document.querySelector(".navbar").classList.toggle("active");
});

$(document).ready(function () {
  initListeners();
});
