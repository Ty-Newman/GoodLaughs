const bows = document.getElementsByClassName("bow");
for (let i = 0; i < bows.length; i++) {
  bows[i].addEventListener("click", (event) => {
    const laughContainer = event.currentTarget.parentNode;
    const childNodes = laughContainer.childNodes;
    let username = "";
    let laughBody = "";
    for (let node of childNodes) {
      if (node.id === "user-name") {
        username = node.innerHTML;
      } else if (node.id === "body") {
        laughBody = node.innerHTML;
      }
    }

    console.log(username, laughBody);
    if (username.length > 0 && laughBody.length > 0) {
      window.location.href = "/ratings/" + username + "/" + laughBody;
    }
    // user needs to be logged in for this to work otherwise security risk
    // fire off window.location.href, flip whatever is in the database
  });
}
