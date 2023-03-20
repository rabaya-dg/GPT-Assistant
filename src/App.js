import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./ui/app.scss";
import LogoLight from "./assets/LogoLight.svg";
import LogoDark from "./assets/LogoDark.svg";
import Brand from "./assets/brand.svg";

import IconLight from "./assets/logo-icon-light.svg";
import IconDark from "./assets/logo-icon-dark.svg";
import { Configuration, OpenAIApi } from "openai";

const App = () => {
    const [chat, sendChat] = useState([]);
    const [response, setResponse] = useState([]);
    const [replyLoading, setReplyLoading] = useState(false);
    const chatWindowTarget = useRef(null);

    const [currentThemeMode, setCurrentThemeMode] = useState(
        localStorage.getItem("theme") || "light"
    );

    const currentMode = localStorage.getItem("theme");

    if (currentMode) {
        document.documentElement.setAttribute("data-theme", currentMode);
    }

    const toggleMode = () => {
        let currentMode = document.documentElement.getAttribute("data-theme");
        let toggleMode = "light";

        if (currentMode === "light") {
            toggleMode = "dark";
        } else {
            toggleMode = "light";
        }

        document.documentElement.setAttribute("data-theme", toggleMode);
        localStorage.setItem("theme", toggleMode);
        setCurrentThemeMode(toggleMode);
    };

    const message = useRef(null);

    const handleChat = (e) => {
        if (!navigator.onLine) {
            toast.error("Please check your internet connection.");
        } else {
            e.stopPropagation();
            setReplyLoading(true);
            sendChat([...chat, message.current.value]);

            const openai = new OpenAIApi(
                new Configuration({
                    apiKey: "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",
                })
            );

            openai
                .createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: message.current.value.toLowerCase(),
                        },
                    ],
                })
                .then((data) => {
                    setReplyLoading(false);
                    setResponse([
                        ...response,
                        data.data.choices[0].message.content.replace(
                            "\n\n",
                            ""
                        ),
                    ]);
                    console.log(data.data.choices[0].message.content);
                    console.log(message.current.value.toLowerCase());
                    message.current.value = "";
                })
                .catch((err) => {
                    sendChat([]);
                    setResponse([]);
                    setReplyLoading(false);
                    message.current.value = "";
                    toast.error("Something went wrong!");
                });
        }
    };

    const trash = () => {
        sendChat([]);
        setResponse([]);
        setReplyLoading(false);
        message.current.value = "";
        toast.success("Chat cleared!");
    };

    useEffect(() => {
        chatWindowTarget.current.scrollTop =
            chatWindowTarget.current.scrollHeight;
    }, [chat, response]);

    return (
        <div id="wrapper">
            <Toaster
                position="top-center"
                reverseOrder={true}
                toastOptions={{
                    className: "appToast",
                }}
            />
            <header id="header">
                <img
                    src={currentThemeMode === "light" ? IconDark : IconLight}
                    alt="Open AI"
                    id="icon"
                />
                <div id="titleHeader">
                    <span id="title">DG Chat</span>
                    <span id="model">Powered By: GPT-3.5 Turbo</span>
                </div>
                <button id="toggleMode" onClick={toggleMode}>
                    {currentThemeMode === "light" ? (
                        <i className="ic ic-toggle-left"></i>
                    ) : (
                        <i className="ic ic-toggle-right"></i>
                    )}
                </button>
            </header>
            <main id="chat-window" ref={chatWindowTarget}>
                {chat.length <= 0 && (
                    <div id="chat-list-empty">
                        <div id="chat-list-emptyGrid">
                            <img
                                src={
                                    currentThemeMode === "light"
                                        ? LogoLight
                                        : LogoDark
                                }
                                alt="Open AI"
                                id="logo"
                            />
                            <span>Start Chatting</span>
                            <span>Rabaya, DG.</span>

                            <div className="acc">
                                <a
                                    href="https://web.facebook.com/itscodewithdann/"
                                    className="acc-link"
                                >
                                    <i className="ic ic-brand-facebook"></i>
                                </a>
                                <a
                                    href="https://github.com/rabaya-dg"
                                    className="acc-link"
                                >
                                    <i className="ic ic-brand-github"></i>
                                </a>
                            </div>
                            <div className="note">
                                <span>
                                    Note: You may encounter stuck on three dotss
                                    please wait, this means that you may have
                                    slow internet connection or the demand is
                                    high.
                                </span>
                            </div>
                            <div className="author">
                                <span>Developed By: Rabaya, Dann Gil.</span>
                            </div>
                        </div>
                    </div>
                )}
                <ul className="chat-list" id="chat-list-main">
                    {response.map((res, i) => (
                        <>
                            <li className="chat-list-user" key={res[i]}>
                                <div className="user-response">
                                    <pre>{chat[i]}</pre>
                                </div>
                                <div className="chat-list-user-avatar">
                                    <i className="ic ic-user"></i>
                                </div>
                            </li>
                            <li className="chat-list-bot" key={response[i]}>
                                <div className="chat-list-bot-avatar">
                                    <img
                                        src={IconLight}
                                        alt="Open AI"
                                        id="icon"
                                    />
                                </div>
                                <div className="bot-response">
                                    <pre>{response[i]}</pre>
                                </div>
                            </li>
                        </>
                    ))}

                    {replyLoading && (
                        <>
                            <li className="chat-list-user">
                                <div className="user-response">
                                    <pre>{chat[chat.length - 1]}</pre>
                                </div>
                                <div className="chat-list-user-avatar">
                                    <i className="ic ic-user"></i>
                                </div>
                            </li>
                            <li className="chat-list-bot">
                                <div className="chat-list-bot-avatar">
                                    <img
                                        src={IconLight}
                                        alt="Open AI"
                                        id="icon"
                                    />
                                </div>
                                <div className="bot-response">
                                    <div id="replying">
                                        <div id="wave">
                                            <span className="dot one"></span>
                                            <span className="dot two"></span>
                                            <span className="dot three"></span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </>
                    )}
                </ul>
            </main>
            <footer id="chat-box">
                <button id="clearScreen" onClick={trash}>
                    <i className="ic ic-trash"></i>
                </button>
                <input
                    disabled={replyLoading ? true : false}
                    type="text"
                    name="chat"
                    id="chat"
                    placeholder="Message ..."
                    ref={message}
                />
                <button
                    id="chat-send"
                    onClick={handleChat}
                    disabled={
                        replyLoading
                            ? true
                            : false || message.current < 0
                            ? true
                            : false
                    }
                >
                    <i className="ic ic-send"></i>
                </button>
            </footer>
        </div>
    );
};

export default App;
