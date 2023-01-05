window.CRISP_READY_TRIGGER = function () {

    if (window.ShowCrispButton) {
        return false;
    }

    const crispButtonSelector = ".crisp-client #crisp-chatbox > div > a.cc-unoo";
    const crispButtonHiddenStyle = "display:none !important;";

    const crispButton = document.querySelector(crispButtonSelector);

    // Hide the Crisp button
    if (crispButton) {
        crispButton.style = crispButtonHiddenStyle;
    }
    else {
        /**
         * Not the best solution, because hide the chat in CRISP_READY_TRIGGER can cause display bug sometimes
         * It's just in case of the selector doesn't work (class name changed, navigateur doesn't support, etc)
         * */

        window.$crisp.push(["do", "chat:hide"]);
        window.$crisp.push(["do", "chat:close"]);

        window.$crisp.push(["on", "chat:closed", () => {
            setTimeout(function () {
                window.$crisp.push(["do", "chat:hide"]);
            }, 400);
        }]);
    }

    window.$crisp.push(["on", "chat:opened", () => {
        /**
         * Hide again the Crisp button,
         * because the HTML button is reset the first time a session is loaded
         */
        const crispButton = document.querySelector(crispButtonSelector);
        crispButton.style = crispButtonHiddenStyle;

        window.$crisp.push(["do", "chat:show"]);
    }]);
};