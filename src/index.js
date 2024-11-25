import * as $ from "jquery";
import { changePage } from "../src/model.js";
import { signUserUp } from "../src/model.js";

function initListeners() {
  $("nav a").on("click", function (e) {
    e.preventDefault();
    let pageID = $(this).attr("id");
    console.log("Navigating to page:", pageID);
    changePage(pageID);
  });

  $("#submit").on("click", () => {
    const firstName = $("#fName").val();
    const lastName = $("#lName").val();
    const email = $("#email").val();
    const password = $("#password").val();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields.");
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
    alert("Recipe Submitted");
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
      console.log("data " + data);
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
    });
  } else {
    $.get(`pages/home/home.html`, function (data) {
      console.log("data " + data);
      $("#app").html(data);
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
