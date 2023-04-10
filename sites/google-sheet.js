function findByText() {
  // get the root element,
  // you can start from the body
  const textboxes = document.querySelectorAll('[role="textbox"]');
  const comboboxes = document.querySelectorAll('[role="combobox"]');
  const textAreas = document.querySelectorAll("textarea");
  const codeMirror = document.querySelectorAll(".CodeMirror-code");

  searchAndUpdate([
    { el: textboxes, isInputType: false },
    { el: comboboxes, isInputType: false },
    { el: textAreas, isInputType: true },
    { el: codeMirror, isInputType: false },
  ]);
}

function searchAndUpdate(nodesArray) {
  nodesArray.forEach(({ el, isInputType }) => {
    for (let node of el) {
      const value = node.textContent;
      if (node && value) {
        const text = getTextParsed(value);
        if (text) {
          makeChatGPTCall(text, node).then((e) => {
            update(node, e, isInputType);
          });
        }
      }
    }
  });
}

function update(node, text, isInputType = false) {
  if (isInputType) {
    node.value = text;
  } else {
    if (node.hasChildNodes()) {
      node.children[0].innerText = text;
    }
  }
}
