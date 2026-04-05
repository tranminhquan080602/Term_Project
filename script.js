let messages = [];//moved out to be a oublic variable


let talk = async () => {
    let userInput = document.querySelector("#userInput").value;
    messages.push({ role: "user", content: userInput });
    let response = await fetch("https://128.compsci.cc/api/chatbot/",
        {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        }
    );
    let json = await response.json();
    console.log(json);
    userBubble(userInput);// user text
    botBubble(json);//bot text
    document.querySelector("#userInput").value = "";//delete the previous user text in the text area
}

//Bot bubble
const botBubble = (botText) => {
    if (botText.message) {
        let botAns = botText.message.content;
        messages.push({ role: "assistant", content: botAns });
        document.querySelector("#chatBody").innerHTML += `
    <div class="d-flex justify-content-start">
            <div class="chatBubble aiMsg ms-4 p-4">
                ${botAns}
            </div>
        </div>
    `;
        //I want the screen to sroll down automatically after the messages filled the screen. Like how the message work on phones, instead of manually scrolling down.
        let scrollBox = document.querySelector("#chatBody");
        scrollBox.scrollTop = scrollBox.scrollHeight;
    }
}

const userBubble = (uText) => {
    document.querySelector("#chatBody").innerHTML += `
        <div class="d-flex justify-content-end me-4 p-4">
            <div class="chatBubble userMsg me-4 p-4">
                ${uText}
            </div>
        </div> 
    `;
}

document.querySelector("#sendBtn").addEventListener("click", () => {
    talk();
});