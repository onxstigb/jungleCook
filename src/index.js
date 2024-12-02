import * as $ from "jquery";
import { changePage } from "./model.js";
import { signUserUp } from "./model.js";
import Swal from "sweetalert2"; // Import SweetAlert2 for alerts

// Initialize listeners for navigation, form submission, and dynamic recipe input handling
function initListeners() {
  // Handle navigation clicks to change pages
  $("nav a").on("click", function (e) {
    e.preventDefault();
    let pageID = $(this).attr("id");
    console.log("Navigating to page:", pageID);
    if (!pageID) {
      console.error("Page ID is undefined or invalid");
      return;
    }
    changePage(pageID);
  });

  // Form submission for user registration
  $("#submit").on("click", () => {
    const firstName = $("#fName").val();
    const lastName = $("#lName").val();
    const email = $("#email").val();
    const password = $("#password").val();

    if (!firstName || !lastName || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields.",
      });
      return;
    }

    signUserUp(firstName, lastName, email, password);
    console.log("Form submitted with:", {
      firstName,
      lastName,
      email,
      password,
    });
  });
}

$(document).ready(function () {
  initListeners();
  console.log("DOM is ready!");
});

// Handle hamburger menu toggle
document.getElementById("hamburger").addEventListener("click", function () {
  document.querySelector(".navbar").classList.toggle("active");
});

// Handle hash-based page routing
function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");

  if (pageID !== "") {
    $.get(`pages/${pageID}.html`, function (data) {
      console.log("Loaded page:", pageID);
      $("#app").html(data); // Update the page content
      addRecipeListeners(); // Re-attach recipe listeners if necessary

      if (pageID == "recipeForm") {
        // No additional actions unless needed
      } else if (pageID == "showAllRecipes") {
        showAllRecipes(); // Ensure that recipes are displayed when this page loads
        removeRecipeListeners();
      } else {
        removeRecipeListeners(); // Remove listeners if unnecessary
      }
    }).fail(function () {
      Swal.fire({
        icon: "error",
        title: "Page Not Found",
        text: `The page ${pageID} could not be found.`,
      });
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      console.log("Loaded home page");
      $("#app").html(data); // Load the home page by default
    }).fail(function () {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Home page could not be loaded.",
      });
    });
  }
}

// Initialize the URL listener for handling hash-based navigation
function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute(); // Call immediately to handle the initial URL
}

// Array to hold user recipes
const userRecipes = [];

// Add event listeners to dynamically add ingredients, instructions, and handle form submission
function addRecipeListeners() {
  // Add ingredient input fields dynamically
  $("#ingredBtn").on("click", function () {
    console.log("Adding ingredient input...");
    let currentIngredCount = $(".ingreds input").length;
    currentIngredCount++;
    $(".ingreds").append(
      `<input type="text" id="ingred${currentIngredCount}" placeholder="ingredient ${currentIngredCount}" />`
    );
  });

  // Add instruction input fields dynamically
  $("#instructBtn").on("click", function () {
    console.log("Adding instruction input...");
    let currentInstructCount = $(".instructs input").length;
    currentInstructCount++;
    $(".instructs").append(
      `<input type="text" id="instruct${currentInstructCount}" placeholder="instruction ${currentInstructCount}" />`
    );
  });

  // Handle recipe submission
  $(".submitBtn").on("click", function () {
    let recipe = {
      recipeName: $("#recipeName").val(),
      recipeImageURL: $("#imageURL").val(),
      ingredients: [],
      instructions: [],
    };

    // Collect ingredients and instructions from input fields
    $(".ingreds input").each(function () {
      recipe.ingredients.push($(this).val());
    });

    $(".instructs input").each(function () {
      recipe.instructions.push($(this).val());
    });

    userRecipes.push(recipe);
    Swal.fire({
      icon: "success",
      title: "Recipe Submitted",
      text: "Your recipe has been submitted successfully.",
    });
    $(".form input").val(""); // Clear form inputs
    console.log(userRecipes);

    // Automatically show the new recipe on the same page after submission
    showAllRecipes();
  });
}

function removeRecipeListeners() {
  // Remove event listeners to avoid duplication when changing pages
  $("#ingredBtn").off("click");
  $("#instructBtn").off("click");
  $(".submitBtn").off("click");
}

// Function to show all recipes
function showAllRecipes() {
  let recipeStr = "";
  $.each(userRecipes, (index, recipe) => {
    recipeStr += `
      <div class="recipe">
        <div class="recipeImageHolder">
          <img src="${recipe.recipeImageURL}" alt="Recipe Image"/>
        </div>
        <div class="recipeDescription">
          <h2>${recipe.recipeName}</h2>
          <p>Ingredients: ${recipe.ingredients.join(", ")}</p>
          <p>Instructions: ${recipe.instructions.join(", ")}</p>
        </div>
      </div>
    `;
  });
  $("#showAllRecipes").html(recipeStr); // Display the recipes in the container
}

function signupListeners() {
  $("#submit").on("click", () => {
    const firstName = $("#fName").val();
    const lastName = $("#lName").val();
    const email = $("#message").val();
  });
}

$(document).ready(function () {
  addRecipeListeners(); // Add the event listeners for recipe actions
});

$(document).ready(function () {
  signupListeners(); // Add the event listeners for recipe actions
});

$(document).ready(function () {
  initURLListener(); // Initialize the URL listener for routing
});
