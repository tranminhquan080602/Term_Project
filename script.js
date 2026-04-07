let messages = [];//moved out to be a oublic variable, easier to push the bot answer and the user text
let uLastestText = ""; //store it as a public variable so i can use it in the savingCon() to save user and bot message.

let talk = async () => {
    let userInput = document.querySelector("#userInput").value;
    uLastestText = userInput;
    //check if the user input is empty
    if (userInput == "") {
        userBubble(userInput);
        return //prevent the empty text from being sent
    }
    userBubble(userInput);
    messages.push({ role: "user", content: userInput });
    document.querySelector("#userInput").value = "";//delete the previous user text in the text area after sending
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
    botBubble(json);//bot text
}

//Bot bubble
const botBubble = async (botText) => {
    if (botText.message) {
        let botAns = botText.message.content; //retrieve the bot answer 
        messages.push({ role: "assistant", content: botAns }); //push it into message [] to build history, or else the bot will forget

        //thinking state, i use jquery so it's easier for me to append class
        //append the class "think" to target the latest bubble
        $("#chatBody").append(`
            <div class="d-flex justify-content-start think">
                <div class="chatBubble aiMsg ms-4 p-4">
                    Thinking...
                </div>
            </div>
            `);
        //I want the screen to sroll down automatically after the messages filled the screen. Like how the message work on phones, instead of manually scrolling down.
        let scrollBox = document.querySelector("#chatBody");
        scrollBox.scrollTop = scrollBox.scrollHeight;

        //My idea is to fade in, stay for a bit and fade out. but i need to hide it first in order to fade in.
        $(".think").hide().fadeIn(500).delay(1000).fadeOut(500, () => {
            $(".think").remove(); //Remove the thinking bubble
            $("#chatBody").append(`
            <div class="d-flex justify-content-start">
                <div class="chatBubble aiMsg ms-4 p-4">
                    ${botAns}
                </div>
            </div>
            `);


        });
        //I tried the try/catch to test for errors
        //save conversation
        try {
            const savingCon = await fetch("https://quan.json.compsci.cc/conversation/", {
                method: "POST",

                body: JSON.stringify({
                    userText: uLastestText,
                    botText: botAns
                })
            })
            if (savingCon.ok) {
                console.log("YAYYYYYYYYYYYYYY");
            }
        }

        catch (err) {
            console.log(err);
        }
    }
}

const userBubble = (uText) => {
    if (uText == "") {
        //trigger the error modal from the official bootstrap webiste 
        let modal = new bootstrap.Modal(document.querySelector("#myModal"));
        modal.show();
    }

    else {
        document.querySelector("#chatBody").innerHTML += `
        <div class="d-flex justify-content-end">
            <div class="chatBubble userMsg me-4 p-4">
                ${uText}
            </div>
        </div> 
    `;
    }

}

//Eventlistener for the button
document.querySelector("#sendBtn").addEventListener("click", () => {
    talk();
});

//enter key
document.querySelector("#userInput").addEventListener("keydown", (enterKey) => {
    if (enterKey.key == "Enter" && !enterKey.shiftKey) { //only send when the shift key is lifted
        enterKey.preventDefault(); //The enter key is used to go to a new line by defauly. when the key is pressed, there's a small delay where it will go to a new line before sending the message, i use preventDefault() to prevent that.
        talk();
    }
})

