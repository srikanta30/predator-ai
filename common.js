// 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
apiKey = null;

// get the api key on load
chrome.storage.sync.get("predator-chatgpt-apikey", (val) => {
  const value = val["predator-chatgpt-apikey"];
  apiKey = value;
});

// if the api key changes
chrome.runtime.onMessage.addListener(function ({ data }, sender, sendResponse) {
  console.log("inside");
  apiKey = data;
  sendResponse("received api key");
});

const getTextParsed = (text) => {
  // const parsed = /<predator>(.*?)<\/predator>/g.exec(text);
  const parsed = /predator:(.*?)\;/gi.exec(text);
  return parsed ? parsed[1] : "";
};

const makeChatGPTCall = async (text, node) => {
  if (!apiKey) {
    console.error("Chatgpt Api key for Predator AI is missing");
    return text;
  }

  //   console.log(text, node);
  toggleLoadingIcon(node);
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${apiKey}`);

    const raw = JSON.stringify({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 2048,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response = await fetch("https://api.openai.com/v1/completions", requestOptions);
    response = await response.json();
    const { choices } = response;
    return choices[0].text.replace(/^\s+|\s+$/g, "");
  } catch (e) {
    console.error("Error while calling openai api", e);
  } finally {
    toggleLoadingIcon(node, false);
  }
};

// helper function to add a loader whenever an network request to ChatGPT is made
let loaderElement = null;
const toggleLoadingIcon = (node, show = true) => {
  if (!loaderElement) {
    const ele = document.createElement("img");
    ele.src = chrome.runtime.getURL(`icons/loading.gif`);
    ele.style.width = "50px";
    ele.style.position = "absolute";
    ele.style.right = "0";
    ele.style.bottom = "15px";
    loaderElement = ele;
  }

  if (show) {
    node.parentNode.appendChild(loaderElement);
  } else {
    if (node.parentNode.contains(loaderElement)) {
      node.parentNode.removeChild(loaderElement);
    }
  }
};

const getTextContentFromDOMElements = (nodes, textarea = false) => {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  for (let node of nodes) {
    const value = textarea ? node.value : node.textContent;
    if (node && value) {
      const text = getTextParsed(value);
      if (text) return [node, text];
      else return null;
    }
  }
};

// helper function to debounce function calls
function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}
