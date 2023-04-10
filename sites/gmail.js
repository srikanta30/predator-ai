const checkApiKeyAndExecute = () => {
  if (!apiKey) {
    console.error("Chatgpt Api key for Predator AI is missing");
  } else {
    findByText();
  }
};

const debouncedSearch = debounce(checkApiKeyAndExecute, 1500);

function search() {
  debouncedSearch();
}

(function checkForNewIframe(doc) {
  if (!doc) return; // document does not exist. Cya

  // Note: It is important to use "true", to bind events to the capturing
  // phase. If omitted or set to false, the event listener will be bound
  // to the bubbling phase, where the event is not visible any more when
  // Gmail calls event.stopPropagation().
  // Calling addEventListener with the same arguments multiple times bind
  // the listener only once, so we don't have to set a guard for that.
  doc.addEventListener("keypress", search, true);
  doc.addEventListener("paste", search, true);
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
