/*
 * TODO: fix for Teams: Currently the textbox is rendered in Iframe and find a way to update its content;
 */
console.log("vutler");
function findByText(doc = document) {
  console.log("vutler", window.parent);
  try {
    const el = doc.querySelectorAll('[role="textbox"]');
    console.log("vutler", el);
    const val = getTextContentFromDOMElements(el);
    console.log("vutler", val);
    if (!val) return;
    const [node, text] = val;
    makeChatGPTCall(text, node)
      .then((resp) => {
        teamsUpdate(node, resp);
      })
      .catch((e) => {
        console.error("Predator failed on Teams", e);
      });
  } catch (e) {
    console.error("Predator failed on Teams", e);
  }
}

function teamsUpdate(actEl, text) {
  console.log("vutler text", text);
  actEl.lastChild.textContent = text;
  actEl.dispatchEvent(new InputEvent("input", { bubbles: true }));
}

const debouncedSearch = debounce(findByText, 1500);

(function checkForNewIframe(doc) {
  if (!doc) return; // document does not exist. Cya

  // Note: It is important to use "true", to bind events to the capturing
  // phase. If omitted or set to false, the event listener will be bound
  // to the bubbling phase, where the event is not visible any more when
  // Gmail calls event.stopPropagation().
  // Calling addEventListener with the same arguments multiple times bind
  // the listener only once, so we don't have to set a guard for that.
  doc.addEventListener("keypress", () => debouncedSearch(doc), true);
  doc.addEventListener("paste", () => debouncedSearch(doc), true);
  // doc.addEventListener('keyup', keyUp, true);
  doc.hasSeenDocument = true;
  for (var i = 0, contentDocument; i < frames.length; i++) {
    try {
      contentDocument = iframes[i].document;
    } catch (e) {
      continue; // Same-origin policy violation?
    }
    if (contentDocument && !contentDocument.hasSeenDocument) {
      // Add poller to the new iframe
      checkForNewIframe(iframes[i].contentDocument);
    }
  }
  setTimeout(checkForNewIframe, 250, doc); // <-- delay of 1/4 second
})(document); // Initiate recursive function for the document.
