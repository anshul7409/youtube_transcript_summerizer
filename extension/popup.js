const btn = document.getElementById("summarise");
const input_url = document.getElementById("input");
const prefix = "https://www.youtube.com/watch?v=";
const xhr = new XMLHttpRequest();
const cancilbtn = document.getElementById("cancil");
const p = document.getElementById("output");
var url = "";
var Store = new Map();


chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var isinput = 1;
        var parent = document.getElementById("parent");
        var ele = document.createElement('h1');
        parent.appendChild(ele)
        cancilbtn.style.display = "none";
        
        if (tabs && tabs.length > 0) {
            var taburl = tabs[0].url;
            console.log(taburl);
            try {
                if (taburl != "" && taburl.includes(prefix)) {
                    url = taburl;
                    isinput = 0;
                    console.log("send request to api with URL -> when user clicks the summarize button");
                    ele.innerHTML = "Successfully fetched!";
                    input_url.style.display = "none";
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }

        if (isinput == 1) {
            console.log("show input box for entering URL");
            var inputurl = '';
            var isValidURL = false; // Flag to track whether a valid URL was entered before
            input_url.addEventListener("input", function () {
                inputurl = input_url.value;
                inputurl = inputurl.trim();
                url = inputurl;
                if (inputurl.includes(prefix)) {
                    isValidURL = true; // Valid URL entered
                    ele.innerHTML = "Successfully fetched!";
                    btn.disabled = false; // Enable the button
                } else {
                    isValidURL = false; // Invalid URL or empty input
                    if(inputurl == ""){
                        ele.innerHTML = "empty input"; 
                    }else{
                        ele.innerHTML = "please enter valid input!"; 
                    }
            
                    btn.disabled = true; // Disable the button
                }
            });
        } 

        // Add a click event listener to the button
        btn.addEventListener("click", function () {
                if (Store.has(url)) {
                    ele.innerHTML =  "already exists";
                    var oldtext = Store.get(url);
                    p.innerHTML = oldtext;
                }else if (isValidURL || isinput == 0) {
                    // btn.disabled = true;
                    // input_url.disabled = true;
                    // btn.innerHTML = "Summarising...";
                    // xhr.onload = function () {
                    //     var text = xhr.responseText;
                    //     Store.set(url,text)
                    //     input_url.disabled = false;
                    //     p.innerHTML = text;
                    //     btn.disabled = false;
                    //     btn.innerHTML = "Summarise";
                    //     cancilbtn.style.display = "none";
                    //     ele.innerHTML = "done"
                    // }

                    // // cancil the summarization api call process
                    // cancilbtn.style.display = "block";
                    // cancilbtn.addEventListener("click",function () {
                    //         console.log("cancil button clicked");
                    //         xhr.abort()
                    //         ele.innerHTML = "Terminated!";     
                    //         btn.innerHTML = "Summarize";
                    //         cancilbtn.style.display = "none" ;   
                    //         btn.disabled = false;
                    //         input_url.disabled = false;
                    // });
                                       
                    // // Set the method (GET or POST) and open the connection
                    // xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + url, true);
                     
                    // // Send the request
                    // xhr.send();
                    btn.disabled = true;
                    input_url.disabled = true;
                    btn.innerHTML = "Summarising...";
                    var cancil = false;
                    const request = {"url":url,"cancil":cancil};
                    cancilbtn.style.display = "block";
                    cancilbtn.addEventListener("click",function () {
                            console.log("cancil button clicked");
                            ele.innerHTML = "Terminated!";     
                            btn.innerHTML = "Summarize";
                            cancilbtn.style.display = "none" ;   
                            btn.disabled = false;
                            input_url.disabled = false;
                            p.style.display = "none";
                            cancil = true
                    });
                    chrome.runtime.sendMessage(request);
                    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                        if(request.action === "summary"){
                            cancilbtn.style.display = "none";
                            btn.innerHTML = "Summarise";
                            btn.disabled = false;
                            input_url.disabled = false;
                            Store.set(url,request.text)
                            if(cancil == false){
                                p.innerHTML = request.text;
                            }
                            sendResponse("got the summary")
                        }
                    })
                }else{
                    ele.innerHTML = "please enter valid input!";
                }
        });
});

