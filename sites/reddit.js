function findByText() {
  try {
    const el = document.querySelectorAll('[role="textbox"]');
    const val = getTextContentFromDOMElements(el);
    if (!val) return;
    const [node, text] = val;
    makeChatGPTCall(text, node)
      .then((resp) => {
        facebookUpdate(node, resp);
      })
      .catch((e) => {
        console.error("Predator failed on Reddit", e);
      });
  } catch (e) {
    console.error("Predator failed on Reddit", e);
  }
}

function facebookUpdate(actEl, text) {
  var dc = getDeepestChild(actEl);
  var elementToDispatchEventFrom = dc.parentElement;
  let newEl;
  if (dc.nodeName.toLowerCase() == "br") {
    // attempt to paste into empty messenger field
    // by creating new element and setting it's value
    newEl = document.createElement("span");
    newEl.setAttribute("data-text", "true");
    dc.parentElement.appendChild(newEl);
    newEl.innerText = text;
  } else {
    // attempt to paste into not empty messenger field
    // by changing existing content
    //   let sel = document.getSelection();
    //   selStart = sel.anchorOffset;
    //   selStartCopy = selStart;
    //   selEnd = sel.focusOffset;

    //   intendedValue = dc.textContent.slice(0, selStart) + text + dc.textContent.slice(selEnd);
    dc.textContent = text;
    elementToDispatchEventFrom = elementToDispatchEventFrom.parentElement;
  }
  // simulate user's input
  elementToDispatchEventFrom.dispatchEvent(new InputEvent("input", { bubbles: true }));
  // remove new element if it exists
  // otherwise there will be two of them after
  // Facebook adds it itself!
  if (newEl) newEl.remove();
}

function getDeepestChild(element) {
  if (element.lastChild) {
    return getDeepestChild(element.lastChild);
  } else {
    return element;
  }
}
