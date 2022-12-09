chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addHighlight",
    title: "Highlight",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
  const text = item.selectionText;
  if (item.menuItemId === "addHighlight") {
    chrome.tabs.sendMessage(tab.id, {
      type: "ADD_HIGHLIGHT",
      text,
    });
  }
  //   else if (item.menuItemId === "addNote") {
  //     chrome.tabs.sendMessage(tab.id, {
  //       type: "ADD_NOTE",
  //       text,
  //     });
  //   }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    chrome.tabs.sendMessage(
      tabId,
      {
        type: "NEW",
        webUrl: tab.url,
        tabId,
      },
      function (response) {
        //On response alert the response
        console.log(
          "The response from the content script: " + response.response
        ); //You have to choose which part of the response you want to display ie. response.response
      }
    );
  }
});