import { GoogleGenAI } from "@google/genai";
import { IoSend } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiGeminiFill } from "react-icons/ri";
import { BiSolidPlanet } from "react-icons/bi";
import { MdOutlineLightMode } from "react-icons/md";
import { RiChatNewLine } from "react-icons/ri";
import { useState } from "react";

import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [messages, setMessages] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // function to get response from gemini API
  async function getResponse() {
    setLoading(true);
    // console.log("loading....");
    try {
      const currentPrompt = prompt;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: currentPrompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      const botReply = data["candidates"][0]["content"]["parts"][0]["text"];

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: currentPrompt,
          bot: botReply,
        },
      ]);

      setPrompt(""); // clearing the input
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  }

  // function to reset chat

  const reset = () => {
    setMessages([]);
    setAnswer("");
    setPrompt("");
  };

  return (
    <>
      <div
        className={`h-[100vh] w-[100vw] bg-black flex flex-col items-center gap-5 transition-colors duration-300 ${
          darkMode ? "bg-black" : "bg-white"
        } `}
      >
        {/* header div for icons and buttons */}
        <div
          className={`head-div  w-[100vw] flex items-center justify-between md:justify-evenly p-5 transition-colors duration-300 ${
            darkMode
              ? "bg-[#181818] text-white"
              : "bg-white , text-black shadow-md shadow-gray-300"
          }`}
        >
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="text-white text-2xl font-bold"
          >
            <MdOutlineLightMode
              className={`hover:text-green-600 transition-all duration-300 cursor-pointer ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
          </button>
          <header>
            <h1 className=" text-2xl font-semibold">AssistGPT</h1>
          </header>
          <button onClick={reset} className="new-chat  text-2xl font-bold">
            <RiChatNewLine className="hover:text-green-600 transition-all duration-300 cursor-pointer" />
          </button>
        </div>
        {/* body div for main content like chats  */}
        <div
          className={` h-[75%] w-[100vw] md:w-[70%] flex flex-col items-center justify-center gap-5 transition-colors duration-300 ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          {messages.length > 0 ? (
            <>
              <div className="messages bg-transparent h-[75%] w-[100vw] md:w-[75%] overflow-y-scroll  ">
                {messages.map((msg, index) => (
                  <div key={index} className="mb-4 flex flex-col">
                    <div className="user-msg mb-2 ">
                      <p className="bg-[#181818] text-white p-2 rounded-md">
                        {msg.user}
                      </p>
                    </div>
                    <div className="response">
                      <p className="bg-[#181818] text-white rounded-md p-2 break-words whitespace-pre-wrap">
                        {msg.bot}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-white">
                    <svg
                      className="animate-spin h-5 w-5 text-green-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span>AssistGPT is typing...</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="bg-transparent text-3xl ">
                <p className="">What can i help you with</p>
              </div>
              {/* dummy prompt cards */}
              <div className="  p-4 grid grid-cols-2 gap-4 md:flex">
                <div className="relative bg-[#181818] text-white p-8 rounded-lg cursor-pointer ">
                  What is the weather today{" "}
                  <TiWeatherPartlySunny className="absolute bottom-2 right-5 text-2xl" />
                </div>
                <div className="relative bg-[#181818] text-white p-8 rounded-lg cursor-pointer">
                  What is React and how can i learn it{" "}
                  <FaReact className="absolute bottom-2 right-5 text-2xl animate-spin" />
                </div>
                <div className="relative bg-[#181818] text-white p-8 rounded-lg cursor-pointer text-wrap ">
                  <p> Which is the largest planet in our solar system </p>
                  <BiSolidPlanet className="absolute bottom-2 right-5 text-2xl animate-bounce" />
                </div>
                <div className="relative bg-[#181818] text-white p-8 rounded-lg cursor-pointer">
                  How to use Google Gemini in my project{" "}
                  <RiGeminiFill className="absolute bottom-2 right-5 text-2xl animate-ping" />
                </div>
              </div>
            </>
          )}
        </div>
        {/* the footer div for input fields for users to prompt their qestions  */}
        <div className="bg-[#181818] flex items-center justify-center p-2  gap-20 rounded-3xl w-[85%] sm:w-[50%]">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your messages here....!"
            className="outline-none p-2 bg-transparent text-white w-[75%]"
          />
          {prompt ? (
            <IoSend
              onClick={getResponse}
              className="text-2xl text-green-600 cursor-pointer"
            />
          ) : (
            ""
          )}
        </div>
        <p
          className={` text-center p-2 transition-colors duration-300 ${
            darkMode ? "text-gray-400" : "text-black"
          }`}
        >
          It uses google gemini API to generate responses
        </p>
      </div>
    </>
  );
}

export default App;
