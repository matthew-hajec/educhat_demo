function createUserMessageElement(message) {
    const containerClasses = ["flex", "justify-end"]
    const innerClasses = ["bg-blue-500", "text-white", "rounded-lg", "p-3", "max-w-xs"]

    // Construct the elements
    const containerElem = document.createElement("div");
    containerClasses.forEach((className) => containerElem.classList.add(className));

    const innerElem = document.createElement("div");
    innerClasses.forEach((className) => innerElem.classList.add(className));

    const textElem = document.createElement("p");

    // Put elements together
    containerElem.appendChild(innerElem);
    innerElem.appendChild(textElem);
    textElem.innerText = message;

    return containerElem;
}

// oh noooooo it's a similar function oooh noooooo
function createBotMessageElement(message) {
    const containerClasses = ["flex", "justify-start"]
    const innerClasses = ["bg-gray-200", "text-gray-800", "rounded-lg", "p-3", "max-w-xs"]

    // Construct the elements
    const containerElem = document.createElement("div");
    containerClasses.forEach((className) => containerElem.classList.add(className));

    const innerElem = document.createElement("div");
    innerClasses.forEach((className) => innerElem.classList.add(className));

    const textElem = document.createElement("p");

    // Put elements together
    containerElem.appendChild(innerElem);
    innerElem.appendChild(textElem);
    textElem.innerText = message;

    return containerElem;
}

// returns a promise that resolves to the bot's response as a string
async function queryBot(message) {
    const response = await fetch("/api/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    // Check the status code
    if (response.status !== 200) {
        throw new Error(`Failed to query bot: Status ${response.status}`);
    }

    const responseJSON = await response.json();

    if (!responseJSON.message) {
        throw new Error("Failed to query bot: No message in response");
    }

    return responseJSON.message;
}

function constructBotMessage(response) {
    let message = response.response_text;

    if (response.hint_suggestion) {
        message += `\n\n${response.hint_suggestion}`;
    }

    if (response.next_step_question) {
        message += `\n\n${response.next_step_question}`;
    }

    return message;
}

async function main() {
    const chatContainerElem = document.getElementById("chat-container");
    const chatFormElem = document.getElementById("chat-input-form");
    const chatInputElem = document.getElementById("chat-input");

    // Add a listener to the chat input form
    chatFormElem.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get the message from the form (value of #chat-input), then clear the form
        const message = chatInputElem.value;
        chatInputElem.value = "";

        // Add the user's message to the chat
        const userMessageElem = createUserMessageElement(message);
        chatContainerElem.appendChild(userMessageElem);

        // Query the bot
        let botResponse;
        try {
            botResponse = await queryBot(message);
        } catch (e) {
            console.error(e);
            alert(`An error occurred while querying the bot. ${e.message}`);
            return;
        };

        if (botResponse.bypass_attempt_detected) {
            alert("A bypass attempt was detected. Your teacher will not be pleased.");
        }

        const botMessage = constructBotMessage(botResponse);

        console.log(botMessage);

        // Create the bot message element
        const botMessageElem = createBotMessageElement(botMessage);
        chatContainerElem.appendChild(botMessageElem);
    });
}

// Run main if the route is "/"
if (window.location.pathname === "/") {
    main();
}