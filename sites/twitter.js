function findByText() {
  try {
    const el = document.querySelectorAll('[data-text="true"]');
    const val = getTextContentFromDOMElements(el);
    if (val === null) return;
    const [node, text] = val;
    makeChatGPTCall(text, node)
      .then((resp) => {
        twitterUpdate(resp);
      })
      .catch((e) => {
        console.error("Predator failed on Twitter", e);
      });
  } catch (e) {
    console.error("Predator failed on Twitter", e);
  }
}

function twitterUpdate(text) {
  const textWrapper = document.querySelector('[data-text="true"]')?.parentElement;
  if (textWrapper) {
    textWrapper.innerHTML = `<span data-text="true">${text}</span>`;
    textWrapper.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
  }
}
