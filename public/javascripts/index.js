const bows = document.getElementsByClassName("bow");
for (let i = 0; i < bows.length; i++) {
  bows[i].addEventListener("click", (event) => {
    const laughContainer = event.currentTarget.parentNode;
    const childNodes = laughContainer.childNodes;
    let laughId;
    for (let node of childNodes) {
      if (node.id === "laughId") {
        laughId = node.attributes.name.nodeValue;
      }
    }

    console.log(laughId);
    if (laughId !== undefined) {
      location.href = "ratings/" + laughId;
    }
    // user needs to be logged in for this to work otherwise security risk
    // fire off window.location.href, flip whatever is in the database

    // slow
  });
}
