
chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.action === "summary" && tabs.length > 0){
            alert(request.text);
        }
    })
});