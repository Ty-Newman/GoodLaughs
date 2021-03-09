window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
});

const bows = document.getElementsByClassName("bow");
for (let i = 0; i < bows.length; i++) {
  bows[i].addEventListener("click", (event) => {
    console.log(event.target.attributes);
    // fire off window.location.href, flip whatever is in the database
  });
}

// window.addEventListener("onClick", (event) => {
//   console.log(event.target.id);
//   //       script(src="/javascripts/index.js" type="module" defer)
//   //   -
//   //     function rateBows() {
//   //       console.log("I am here.");
//   //       //- window.location.href = "/laughs/" + laugh.id + "/ratings/";
//   //     }
//   //     rateBows()
// });
