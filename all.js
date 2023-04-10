function findByText() {
  // get the root element,
  // you can start from the body
  const textboxes = document.querySelectorAll('[role="textbox"]');
  const comboboxes = document.querySelectorAll('[role="combobox"]');
  const textAreas = document.querySelectorAll("textarea");
  const codeMirror = document.querySelectorAll(".CodeMirror-code");
  const editableContents = document.querySelectorAll('[contenteditable="true"]');

  searchAndUpdate([
    { el: textboxes, isInputType: false },
    { el: comboboxes, isInputType: false },
    { el: textAreas, isInputType: true },
    { el: codeMirror, isInputType: false },
    { el: editableContents, isInputType: false },
  ]);
}

function searchAndUpdate(nodesArray) {
  nodesArray.forEach(({ el, isInputType }) => {
    const val = getTextContentFromDOMElements(el, isInputType);
    if (!val) return;
    const [node, text] = val;
    makeChatGPTCall(text, node).then((e) => {
      update(node, e, isInputType);
    });
  });
}

function update(node, text, isInputType = false) {
  if (isInputType) {
    node.value = text;
  } else {
    node.innerText = text;
  }
}
