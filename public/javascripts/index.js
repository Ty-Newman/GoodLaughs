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

    if (laughId !== undefined) {
      location.href = "ratings/" + laughId;
    }
  });
}

const laughboxes = document.getElementsByClassName("laughboxes");
for (let i = 0; i < laughboxes.length; i++) {
  laughboxes[i].addEventListener("change", (event) => {
    let laughBoxId;

    const selectedIndex = event.target.options.selectedIndex;

    if (selectedIndex !== 0) {
      laughBoxId = event.target[selectedIndex].attributes[0].nodeValue;
    }
    if (laughBoxId !== undefined) {
      location.href = "laughboxes/" + laughBoxId;
    }
  });
}
