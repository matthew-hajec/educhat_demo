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

async function main() {
    const chatContainerElem = document.getElementById("chat-container");

    const botMsgElem = createBotMessageElement("Hello, human! How can I help you today?");
    const userMsgElem = createUserMessageElement("I'd like to know more about your services.");

    chatContainerElem.appendChild(botMsgElem);
    chatContainerElem.appendChild(userMsgElem);
}

// Run main if the route is "/"
if (window.location.pathname === "/") {
    main();
}