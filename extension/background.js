console.log("hi")

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["display.js"]
    });
}); 

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // const xhr = new XMLHttpRequest();
    if(request.isvalid == true){
        fetch("http://127.0.0.1:5000/summary?url=" + request.url)
            .then(response => response.text())
            .then(data => {
                summary = data;
                url = request.url;
                console.log(url)  
                chrome.runtime.sendMessage({ action: 'summary', text: summary});           
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
    return true;
})

