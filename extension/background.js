console.log("hi")

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["display.js"]
    });
}); 

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // const xhr = new XMLHttpRequest();
    var text = "No response"
    if(request.cancil === false){
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
    // if(request === "i want to summarize"){
    //     sendResponse("ok u can summarize")
    // }
    // console.log(request)
    // sendResponse("No u cant summarize")
})

