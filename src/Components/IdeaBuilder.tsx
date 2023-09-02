import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineLightBulb, HiOutlineDuplicate } from "react-icons/hi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import {
  saveChoices,
  saveConnectionList,
  moveElementIndexToIndex,
  moveConnectionsIndexToIndex,
  moveStringsToStart,
  setCaretToEnd,
  dragStart,
  dragEnter,
  dragLeave,
  dragOver,
  // dragDrop,
  seachIdeas,
} from "../handlers";

interface Props {
  className?: string;
}

const IdeaBuilder = ({ className }: Props) => {
  const [choices, setChoices] = useState<string[]>([]);
  const [connectionList, setConnectionList] = useState<number[]>([]);
  const [toggle, setToggle] = useState<number>(0);

  useEffect(() => {
    if (localStorage.getItem("choices") === null)
      localStorage.setItem("choices", JSON.stringify([]));
    else setChoices(JSON.parse(localStorage.getItem("choices") as string));

    if (localStorage.getItem("connections") === null)
      localStorage.setItem("connections", JSON.stringify([]));
    else
      setConnectionList(
        JSON.parse(localStorage.getItem("connections") as string)
      );
  }, []);

  const dragDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const tempChoices = moveElementIndexToIndex(
      choices,
      parseInt(e.dataTransfer.getData("index")),
      index
    );
    const tempConnections = moveConnectionsIndexToIndex(
      connectionList,
      parseInt(e.dataTransfer.getData("index")),
      index
    );

    const extractedChoices = tempChoices.map((value) => value[0]);
    const a = tempChoices.map((value) => value[1]);
    let b: number[] = [];
    for (let i = 0; i < a.length; i++) {
      b[a[i]] = i;
    }
    const extractedConnections = tempConnections.map((value: number) => {
      if (value === -1) return value;
      return b[value];
    });

    setChoices(extractedChoices);
    setConnectionList(extractedConnections);
    saveChoices(extractedChoices);
    saveConnectionList(extractedConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const addOption = async () => {
    const tempChoices = [...choices, ""];
    const tempConnections = connectionList;
    tempConnections[tempChoices.length - 1] = -1;
    setChoices(tempChoices);
    setConnectionList(tempConnections);
    setTimeout(() => {
      const inputElement = document.getElementById(
        `idea-${tempChoices.length - 1}`
      ) as HTMLDivElement;
      if (inputElement) setCaretToEnd(inputElement);
    }, 50);
    saveChoices(tempChoices);
    saveConnectionList(tempConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const closeOption = (index: number) => {
    const tempChoices = choices.filter((item, i) => i !== index);
    const tempConnections = connectionList
      .filter((item, i) => i !== index)
      .map((value: number, i: number) => {
        if (value === index) return -1;
        if (value > index && value !== -1) return value - 1;
        return value;
      });
    setChoices(tempChoices);
    setConnectionList(tempConnections);
    saveChoices(tempChoices);
    saveConnectionList(tempConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const duplicateIdea = (index: number) => {
    let tempChoices: string[];
    let tempConnections: number[];
    if (index !== choices.length - 1) {
      const firstChoicePart = choices.slice(0, index + 1);
      const secondChoiePart = choices.slice(index + 1);
      const firstConnectionPart = connectionList.slice(0, index + 1);
      const secondConnectionPart = connectionList.slice(index + 1);
      tempChoices = firstChoicePart.concat(choices[index], secondChoiePart);
      tempConnections = firstConnectionPart
        .concat(-1, secondConnectionPart)
        .map((value) =>
          value !== -1 && value > index + 1 ? value + 1 : value
        );
    } else {
      tempChoices = [...choices, choices[index]];
      tempConnections = [...connectionList, -1];
    }
    setChoices(tempChoices);
    setConnectionList(tempConnections);
    setTimeout(() => {
      const inputElement = document.getElementById(
        `idea-${index + 1}`
      ) as HTMLDivElement;
      if (inputElement) setCaretToEnd(inputElement);
    }, 50);
    saveChoices(tempChoices);
    saveConnectionList(tempConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const selectIdea = (index: number, focusIndex: number) => {
    const inputElement = document.getElementById(
      `idea-${focusIndex}`
    ) as HTMLDivElement;
    if (inputElement) {
      const inputText = inputElement.innerText;
      const marker = "<>";
      const startIndex = inputText.indexOf(marker);
      const formattedText = `${inputText.substring(
        0,
        startIndex
      )}<span id="main-span-${focusIndex}" class="highlight rounded-md px-2 ml-1"><>${
        choices[index]
      }</span>`;
      inputElement.innerHTML = formattedText;
      connectionList[focusIndex] = index;
      const textWidthPlaceholder: HTMLDivElement = document.getElementById(
        "textWidthPlaceholder"
      ) as HTMLDivElement;
      const dropdown: HTMLDivElement = document.getElementById(
        "idea-dropdown"
      ) as HTMLDivElement;
      textWidthPlaceholder.textContent = inputElement.innerText;
      dropdown.style.top = `-2000px`;
      dropdown.style.left = `-2000px`;
      setConnectionList(connectionList);
      saveChoices();
      saveConnectionList(connectionList);
      setCaretToEnd(inputElement);
    }
  };

  const handleOnInput = async (e: any, index: number) => {
    const inputElement = document.getElementById(
      `idea-${index}`
    ) as HTMLDivElement;
    const tempChoice = choices;

    if (inputElement) {
      let inputText = inputElement.innerText;
      const marker = "<>";
      const startIndex = inputText.indexOf(marker);
      const dropdown: HTMLDivElement = document.getElementById(
        "idea-dropdown"
      ) as HTMLDivElement;
      dropdown.style.top = `-2000px`;
      dropdown.style.left = `-2000px`;
      const brElements = inputElement.getElementsByTagName("br");
      if (brElements[0]) {
        inputElement.innerHTML = inputElement.innerHTML.replace(/<br>/g, "  ");
      }
      tempChoice[index] = inputText.replace(/\n/g, "");
      if (startIndex !== -1 && tempChoice.length > 1) {
        tempChoice[index] = `${inputText
          .substring(0, startIndex)
          .replace(/\n/g, "")}`;
        const highlightedText = inputText.substring(startIndex + marker.length);
        let formattedText = `${inputText.substring(
          0,
          startIndex
        )}<span id="main-span-${index}" class="highlight rounded-md px-2 ml-1"><>${highlightedText.replace(
          / {2,}/g,
          ""
        )}</span>`;
        const shuffledTempChoice = moveStringsToStart(
          tempChoice,
          highlightedText.replace(/ {2,}/g, "")
        );
        inputElement.innerHTML = formattedText;
        const textWidthPlaceholder: HTMLDivElement = document.getElementById(
          "textWidthPlaceholder"
        ) as HTMLDivElement;
        textWidthPlaceholder.textContent = inputElement.innerText;
        const textWidth: number = textWidthPlaceholder.offsetWidth;
        dropdown.innerHTML = "";
        dropdown.style.maxHeight = "200px";
        dropdown.style.overflowY = "scroll";
        shuffledTempChoice.forEach((element: [string, number], i: number) => {
          if (element[1] !== index) {
            const tempElement = document.createElement("div");
            tempElement.classList.add("idea-selector");
            tempElement.id = `idea-index-${element[1]}`;
            tempElement.innerText = element[0];
            tempElement.style.marginTop = "0.25rem";
            tempElement.style.cursor = "pointer";
            tempElement.style.width = "100%";
            tempElement.style.borderBottomWidth = "1px";
            tempElement.style.borderStyle = "solid";
            tempElement.style.borderColor = "rgb(148 163 184 / 1))";
            tempElement.style.minWidth = "50px";
            tempElement.style.paddingLeft = "0.25rem";
            tempElement.style.paddingRight = "0.25rem";
            if (i === 0)
              tempElement.style.backgroundColor = "rgb(8 145 178 / 1)";
            tempElement.addEventListener("click", () => {
              selectIdea(element[1], index);
            });
            dropdown.append(tempElement);
          }
        });
        dropdown.style.top = `${inputElement.getClientRects()["0"].top + 30}px`;
        dropdown.style.left = `${
          textWidth + inputElement.getClientRects()["0"].left - 10
        }px`;
      }
      setChoices(tempChoice);
      saveChoices();
      saveChoices();
      setCaretToEnd(inputElement);
    }
  };

  const handleKeyDown = async (event: any, index: number) => {
    if (event.key === "Space") {
      event.preventDefault();
      const inputElement = document.getElementById(
        `idea-${index}`
      ) as HTMLDivElement;
      setCaretToEnd(inputElement);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const inputElement = document.getElementById(
        `idea-${index}`
      ) as HTMLDivElement;
      const dropDownElement = document.getElementById(
        "idea-dropdown"
      ) as HTMLDivElement;
      const spanELement = document.getElementById(
        `main-span-${index}`
      ) as HTMLSpanElement;
      if (inputElement && spanELement) {
        let tempIndex = 0;
        const firshChild = dropDownElement.firstElementChild;
        if (firshChild) {
          tempIndex = parseInt(firshChild.id.split("-")[2]);
        }
        selectIdea(tempIndex, index);
      } else await addOption();
    }

    if (event.key === "Backspace") {
      const inputElement = document.getElementById(
        `idea-${index}`
      ) as HTMLDivElement;
      const spanELement = document.getElementById(
        `main-span-${index}`
      ) as HTMLSpanElement;
      if (inputElement && spanELement) {
        event.preventDefault();
        if (spanELement.getAttribute("data-delete") === "true") {
          inputElement.innerHTML = choices[index];
          connectionList[index] = -1;
          setConnectionList(connectionList);
          setCaretToEnd(inputElement);
          saveConnectionList(connectionList);
          const dropdown: HTMLDivElement = document.getElementById(
            "idea-dropdown"
          ) as HTMLDivElement;
          dropdown.style.top = `-2000px`;
          dropdown.style.left = `-2000px`;
        } else {
          spanELement.setAttribute("data-delete", "true");
          spanELement.style.backgroundColor = "gray ";
        }
      }
    }
  };

  return (
    <div
      className={`w-6/12 h-auto min-h-[95%] flex flex-col justify-start items-center ${className}`}
    >
      <div
        id="textWidthPlaceholder"
        className="absolute whitespace-nowrap -top-[100px] text-3xl"
      >
        This is sample text
      </div>
      <div
        id="cat-q"
        className="flex flex-row w-full justify-center items-center"
      >
        <div className="text-blue-200 mr-5">
          <HiOutlineLightBulb
            size={37}
            onClick={() =>
              console.log(
                choices,
                connectionList,
                localStorage.getItem("choices"),
                localStorage.getItem("connections")
              )
            }
          />
        </div>
        <input
          type="text"
          className="w-5/6 h-auto bg-transparent focus:outline-none text-2xl mb-4 border-b-2 border-solid border-blue-700 py-5 text-center text-white"
          placeholder="Search Ideas"
          onChange={(e) => seachIdeas(e)}
        />
        <button className="text-blue-200 ml-5" onClick={addOption}>
          <AiOutlinePlusCircle size={37} />
        </button>
      </div>
      <div
        id="categories"
        className="w-full flex flex-col justify-start items-start h-[calc(100vh-150px)] overflow-y-scroll hidden-scrollbar mt-3"
      >
        <div
          id="list-of-ideas"
          key={toggle}
          className="w-full h-auto flex flex-col-reverse justify-start items-start"
        >
          <div
            id="idea-dropdown"
            className="absolute w-auto h-auto bg-white rounded-md px-1 py-1 hidden-scrollbar"
            style={{ top: "-2000px", left: "-2000px" }}
          ></div>
          <div
            id={`empty-0`}
            className="w-full item outsight"
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDragOver={dragOver}
            onDrop={(e) => dragDrop(e, -1)}
          ></div>
          {choices.map((value, index) => {
            const indexPlusOne = index + 1;
            return (
              <div
                key={`${value}-${index}`}
                className="w-full search-selection"
              >
                <div
                  id={`empty-${indexPlusOne}`}
                  className="w-auto item outsight"
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDragOver={dragOver}
                  onDrop={(e) => dragDrop(e, index)}
                ></div>
                <div
                  className="w-auto h-[100px] border-2 border-solid border-blue-200 items-center pl-3 pr-5 flex flex-row justify-start rounded-md hover:bg-slate-700 cursor-pointer"
                  draggable={true}
                  onDragStart={(e) => dragStart(e, index)}
                  onClick={(e) => {
                    setCaretToEnd(
                      e.currentTarget.querySelector(
                        'div[contenteditable="true"]'
                      )
                    );
                  }}
                >
                  <div className="h-3/6 flex flex-col justify-center border-r-2 border-solid border-blue-200">
                    <MdOutlineDragIndicator
                      size={35}
                      className="h-10/12 pr-1 w-auto text-slate-400"
                    />
                  </div>
                  <div
                    suppressContentEditableWarning={true}
                    id={`idea-${index}`}
                    contentEditable
                    role="textbox"
                    className="px-1 mx-3 w-full h-[20px] text-white focus:outline-none text-2xl flex flex-row justify-start items-center bg-transparent whitespace-nowrap"
                    onInput={async (e) => await handleOnInput(e, index)}
                    onKeyDown={async (e) => await handleKeyDown(e, index)}
                  >
                    {choices[index]}
                    {connectionList[index] !== -1 ? (
                      <span
                        id={`main-span-${index}`}
                        className="highlight rounded-md px-2 ml-1"
                      >{`<>${
                        choices[connectionList[index] as number] ?? ""
                      }`}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col h-full justify-evenly">
                    <RxCrossCircled
                      size={35}
                      className="cursor-pointer text-slate-400"
                      onClick={() => closeOption(index)}
                    />
                    <HiOutlineDuplicate
                      size={35}
                      className="cursor-pointer text-slate-400"
                      onClick={() => duplicateIdea(index)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

IdeaBuilder.defautlProps = {
  className: "",
};

export default IdeaBuilder;
