import * as $ from "jquery";

export function changePage(pageName) {
  console.log("Requested pageName:", pageName);

  if (!pageName) {
    pageName = "home";
  }

  console.log(`Loading ${pageName}.html`);

  $.get(`pages/${pageName}.html`, (data) => {
    console.log(`Successfully loaded: ${pageName}.html`);
    $("#app").html(data);
  }).fail((error) => {
    console.error(`Error loading page ${pageName}:`, error);

    Swal.fire({
      title: "Error loading page",
      text: `There was an issue loading the page: ${error.statusText}`,
      icon: "error",
      confirmButtonText: "Ok",
      showCancelButton: false,
    }).then(() => {
      console.log("Loading fallback page: home.html");
      $.get("../../dist/pages/home.html", (data) => {
        console.log("Successfully loaded fallback home.html");
        $("#app").html(data);
      }).fail((fallbackError) => {
        console.error("Error loading fallback page home:", fallbackError);
        $("#app").html("<h1>Error loading content</h1>");
      });
    });
  });
}

export function signUserUp(fn, ln, email, password) {
  console.log("model.js " + fn, ln, email, password);
}
