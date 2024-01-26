
chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.action === "summary"){
            window.alert(request.text);
        }
    })
});