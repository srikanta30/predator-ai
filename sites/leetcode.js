function findByText() {
  try {
    const el = document.querySelectorAll("textarea");
    const val = getTextContentFromDOMElements(el, true);
    if (val === null) return;

    const [node, text] = val;

    makeChatGPTCall(text, node)
      .then((resp) => {
        leetCodeUpdate(resp);
      })
      .catch((e) => {
        console.error("Predator failed on Leetcode", e);
      });
  } catch (e) {
    console.error("Predator failed on Leetcode", e);
  }
}

function leetCodeUpdate(text) {
  const attrKey = "data-focus-visible-added";
  const attrValue = "true";
  const el = document.querySelector(".inputarea.monaco-mouse-cursor-text");
  el.dispatchEvent(new Event("focus", { bubbles: true, cancelable: true }));
  el.value = text;
  el.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
}
