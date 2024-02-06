chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
        if(response.action === "summary" && tabs.length > 0){
            alert(response.text);
        }
    })
});