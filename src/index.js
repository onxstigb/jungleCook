import * as $ from "jquery";
import { changePage } from "./model.js";
import { signUserUp } from "./model.js";
import Swal from "sweetalert2"; // Import SweetAlert2 for alerts

function initListeners() {
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
});

document.getElementById("hamburger").addEventListener("click", function () {
  document.querySelector(".navbar").classList.toggle("active");
});

const userRecipes = [];

function addRecipeListeners() {
  $("#ingredBtn").on("click", function () {
    let currentIngredCount = $(".ingreds input").length;
    currentIngredCount++;
    $(".ingreds").append(
      `<input type="text" id="ingred${currentIngredCount}" placeholder="ingredient ${currentIngredCount}" />`
    );
  });

  $("#instructBtn").on("click", function () {
    let currentInstructCount = $(".instructs input").length;
    currentInstructCount++;
    $(".instructs").append(
      `<input type="text" id="instruct${currentInstructCount}" placeholder="instruction ${currentInstructCount}" />`
    );
  });

  $(".submitBtn").on("click", function () {
    let recipe = {
      recipeName: $("#recipeName").val(),
      recipeImageURL: $("#imageURL").val(),
      ingredients: [],
      instructions: [],
    };

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
    $(".form input").val("");
    console.log(userRecipes);

    // Automatically show the new recipe on the same page after submission
    showAllRecipes();
  });
}

function removeRecipeListeners() {
  $("#ingredBtn").off("click");
  $("#instructBtn").off("click");
  $(".submitBtn").off("click");
}

function showAllRecipes() {
  let recipeStr = "";
  $.each(userRecipes, (index, recipe) => {
    recipeStr += `
      <div class="recipe">
        <div class="recipeImageHolder">
          <img src="${recipe.recipeImageURL}" alt=""/>
        </div>
        <div class="recipeDescription">
          <h2>${recipe.recipeName}</h2>
          <p>Ingredients: ${recipe.ingredients.join(", ")}</p>
          <p>Instructions: ${recipe.instructions.join(", ")}</p>
        </div>
      </div>
    `;
  });
  $("#showAllRecipes").html(recipeStr);
}

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");

  if (pageID !== "") {
    $.get(`pages/${pageID}.html`, function (data) {
      console.log("Loaded page:", pageID);
      $("#app").html(data);
      addRecipeListeners();
      if (pageID == "recipeForm") {
        // No additional code here unless needed
      } else if (pageID == "showAllRecipes") {
        showAllRecipes(); // Ensure that recipes are displayed when this page loads
        removeRecipeListeners();
      } else {
        removeRecipeListeners();
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
      $("#app").html(data);
    }).fail(function () {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Home page could not be loaded.",
      });
    });
  }
}

function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
}

$(document).ready(function () {
  initURLListener();
});
