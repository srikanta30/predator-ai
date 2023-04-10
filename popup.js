document.getElementById("predator-chatgpt-save").addEventListener("click", (e) => {
  const value = document.getElementById("predator-chatgpt-api-key").value;

  if (value) {
    chrome.storage.sync.set({ "predator-chatgpt-apikey": value });
    document.getElementById("predator-chatgpt-success").textContent =
      "API key is saved, Predator is ready for action!";
    sendMessage(value);
  } else {
    chrome.storage.sync.set({ "predator-chatgpt-apikey": "" });
    document.getElementById("predator-chatgpt-success").textContent = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("predator-chatgpt-apikey", (val) => {
    const value = val["predator-chatgpt-apikey"];
    if (value) {
      document.getElementById("predator-chatgpt-api-key").value = value;
      document.getElementById("predator-chatgpt-success").textContent =
        "API key is saved, Predator is ready for action!";
    }
  });
});

function sendMessage(value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0] && tabs[0].id && tabs[0].url) {
      chrome.tabs.sendMessage(tabs[0].id, { data: value }, function (response) {
        console.log(response);
      });
    } else {
      document.getElementById("predator-chatgpt-success").textContent = "Error!";
    }
  });
}
