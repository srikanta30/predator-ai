// debounced search on keypress and paste events
const checkApiKeyAndExecute = () => {
  if (!apiKey) {
    console.error("Chatgpt Api key for Predator AI is missing");
  } else {
    findByText();
  }
};

debouncedSearch = debounce(checkApiKeyAndExecute, 1500);

window.addEventListener("keypress", debouncedSearch);
window.addEventListener("paste", debouncedSearch);
