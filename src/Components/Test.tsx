/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useEffect, useRef, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineLightBulb, HiOutlineDuplicate } from "react-icons/hi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";

interface Props {
  className?: string;
}

const Test = ({ className }: Props) => {
  const [choices, setChoices] = useState<string[]>([]);
  const [autofocusIndex, setAutofocusIndex] = useState<number>(0);
  const [connectionList, setConnectionList] = useState<(number | null)[]>([]);
  const inputIndex = useRef(-1);

  useEffect(() => {
    // console.log(choices);
  }, [choices]);

  const [toggle, setToggle] = useState(0);

  const moveElementIndexToIndex = (
    array: string[],
    sourceIndex: number,
    destinationIndex: number
  ): string[] => {
    var copyList = [...array];
    var removedElement = copyList.splice(sourceIndex, 1)[0];
    copyList.push(removedElement);
    let dIndex = destinationIndex;
    sourceIndex > destinationIndex
      ? (dIndex = destinationIndex + 1)
      : (dIndex = destinationIndex);
    if (dIndex >= copyList.length) dIndex = copyList.length - 1;
    copyList.splice(dIndex, 0, copyList.pop() as string);
    return copyList;
  };

  const moveConnectionsIndexToIndex = (
    array: (number | null)[],
    sourceIndex: number,
    destinationIndex: number
  ): (number | null)[] => {
    var copyList = [...array];
    var removedElement = copyList.splice(sourceIndex, 1)[0];
    copyList.push(removedElement);
    let dIndex = destinationIndex;
    sourceIndex > destinationIndex
      ? (dIndex = destinationIndex + 1)
      : (dIndex = destinationIndex);
    if (dIndex >= copyList.length) dIndex = copyList.length - 1;
    copyList.splice(dIndex, 0, copyList.pop() as number | null);
    return copyList;
  };

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const conditionOne =
      `empty-${parseInt(e.dataTransfer.getData("index")) + 1}` ===
      (e.target as HTMLDivElement).id;
    const conditionTwo =
      `empty-${e.dataTransfer.getData("index")}` ===
      (e.target as HTMLDivElement).id;
    if (!(conditionOne || conditionTwo))
      (e.target as HTMLDivElement).classList.replace("outsight", "insight");
  };

  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const conditionOne =
      `empty-${parseInt(e.dataTransfer.getData("index")) + 1}` ===
      (e.target as HTMLDivElement).id;
    const conditionTwo =
      `empty-${e.dataTransfer.getData("index")}` ===
      (e.target as HTMLDivElement).id;
    if (!(conditionOne || conditionTwo)) {
      (e.target as HTMLDivElement).classList.replace("insight", "outsight");
    }
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "none";
    if (
      !(
        `empty-${parseInt(e.dataTransfer.getData("index")) + 1}` ===
          (e.target as HTMLDivElement).id ||
        `empty-${e.dataTransfer.getData("index")}` ===
          (e.target as HTMLDivElement).id
      )
    ) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const dragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", `${index}`);
    e.dataTransfer.setData("enter", "false");
  };

  const dragDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setChoices(
      moveElementIndexToIndex(
        choices,
        parseInt(e.dataTransfer.getData("index")),
        index
      )
    );
    setConnectionList(
      moveConnectionsIndexToIndex(
        connectionList,
        parseInt(e.dataTransfer.getData("index")),
        index
      )
    );
    setToggle((prev) => (prev + 1) % 2);
  };

  const addOption = async () => {
    choices.push("");
    connectionList[choices.length - 1] = null;
    setAutofocusIndex(choices.length - 1);
    setChoices(choices);
    setTimeout(() => {
      const inputElement = document.getElementById(
        `idea-${choices.length - 1}`
      ) as HTMLDivElement;
      if (inputElement) inputElement.focus();
    }, 50);
    setToggle((prev) => (prev + 1) % 2);
  };

  const closeOption = (index: number) => {
    setChoices(choices.filter((item, i) => i !== index));
    setConnectionList(connectionList.filter((item, i) => i !== index));
    // console.log(choices, connectionList);
    setAutofocusIndex(index === 0 ? index : index - 1);
    setToggle((prev) => (prev + 1) % 2);
  };

  const duplicateIdea = (index: number) => {
    if (index !== choices.length - 1) {
      choices.splice(index + 1, 0, choices[index]);
      connectionList.splice(index + 1, 0, null);
    } else {
      choices.push("");
      connectionList.push(null);
    }
    // console.log(choices, connectionList);
    setChoices(choices);
    setAutofocusIndex(index + 1);
    setTimeout(() => {
      const inputElement = document.getElementById(
        `idea-${index + 1}`
      ) as HTMLDivElement;
      if (inputElement) inputElement.focus();
    }, 50);
    setToggle((prev) => (prev + 1) % 2);
  };

  const selectIdea = (index: number) => {
    const inputElement = document.getElementById(
      `idea-${autofocusIndex}`
    ) as HTMLDivElement;
    if (inputElement) {
      const inputText = inputElement.innerText;
      const marker = "<>";
      const startIndex = inputText.indexOf(marker);
      const formattedText = `${inputText.substring(
        0,
        startIndex
      )}<span class="highlight rounded-md px-2 ml-1"><>${choices[index].replace(
        "/^[a-zA-Z0-9<> ]*$/",
        ""
      )}</span>`;
      inputElement.innerHTML = formattedText;
      connectionList[autofocusIndex] = index;
      const textWidthPlaceholder: HTMLDivElement = document.getElementById(
        "textWidthPlaceholder"
      ) as HTMLDivElement;
      const dropdown: HTMLDivElement = document.getElementById(
        "idea-dropdown"
      ) as HTMLDivElement;
      textWidthPlaceholder.textContent = inputElement.innerText;
      dropdown.style.top = `-2000px`;
      dropdown.style.left = `-2000px`;
      setCaretToEnd(inputElement);
    }
  };

  const moveStringsToStart = (strs: string[], s1: string) => {
    const matchingStrings: string[] = [];
    const semiMatchingStrings: string[] = [];
    const nonMatchingStrings: string[] = [];

    for (const str of strs) {
      if (str.startsWith(s1)) {
        matchingStrings.push(str);
      } else if (str.includes(s1)) {
        semiMatchingStrings.push(str);
      } else {
        nonMatchingStrings.push(str);
      }
    }

    return matchingStrings
      .concat(semiMatchingStrings)
      .concat(nonMatchingStrings);
  };

  const handleOnInput = async (e: any, index: number) => {
    const inputElement = document.getElementById(
      `idea-${index}`
    ) as HTMLDivElement;
    const tempChoice = choices;
    inputIndex.current = index; // ref update

    if (inputElement) {
      const inputText = inputElement.innerText;
      const marker = "<>";
      const startIndex = inputText.indexOf(marker);

      const dropdown: HTMLDivElement = document.getElementById(
        "idea-dropdown"
      ) as HTMLDivElement;
      dropdown.style.top = `-2000px`;
      dropdown.style.left = `-2000px`;
      tempChoice[index] = inputText
        .replace("/^[a-zA-Z0-9<> ]*$/", "")
        .replace(/\n/g, "");

      if (startIndex !== -1 && tempChoice.length > 1) {
        tempChoice[index] = `${inputText
          .substring(0, startIndex)
          .replace("/^[a-zA-Z0-9<> ]*$/", "")
          .replace(/\n/g, "")}`;
        const highlightedText = inputText.substring(startIndex + marker.length);
        let formattedText = `${inputText.substring(
          0,
          startIndex
        )}<span id="main-span-${index}" class="highlight rounded-md px-2 ml-1"><>${highlightedText.replace(
          /\s+/g,
          ""
        )}</span>`;

        const shuffledTempChoice = moveStringsToStart(
          tempChoice,
          highlightedText.replace(/\s+/g, "")
        );

        // if (
        //   shuffledTempChoice[0].startsWith(highlightedText.replace(/\s+/g, ""))
        // ) {
        //   console.log(
        //     shuffledTempChoice[0].substring(
        //       highlightedText.replace(/\s+/g, "").length
        //     )
        //   );
        //   formattedText = `${inputText.substring(
        //     0,
        //     startIndex
        //   )}<span id="main-span-${index}" class="highlight rounded-md px-2 ml-1"><>${highlightedText.replace(
        //     /\s+/g,
        //     ""
        //   )}</span><span id="sub-span-${index}" class="highlight-less rounded-md px-2">${shuffledTempChoice[0]
        //     .substring(highlightedText.replace(/\s+/g, "").length)
        //     .replace(/\s+/g, "")}</span>`;
        // }

        // const inputSpanElement = document.getElementById(
        //   `main-span-${index}`
        // ) as any;

        inputElement.innerHTML = formattedText;
        // if (inputSpanElement) setCaretToEnd(inputSpanElement);

        const textWidthPlaceholder: HTMLDivElement = document.getElementById(
          "textWidthPlaceholder"
        ) as HTMLDivElement;
        textWidthPlaceholder.textContent = inputElement.innerText;
        const textWidth: number = textWidthPlaceholder.offsetWidth;

        dropdown.innerHTML = "";
        dropdown.style.maxHeight = "200px";
        dropdown.style.overflowY = "scroll";

        shuffledTempChoice.forEach((element: string, i: number) => {
          if (i !== index) {
            const tempElement = document.createElement("div");
            tempElement.classList.add("idea-selector");
            tempElement.id = `index-${i}`;
            tempElement.innerText = element;
            tempElement.style.marginTop = "0.25rem";
            tempElement.style.cursor = "pointer";
            tempElement.style.width = "100%";
            tempElement.style.borderBottomWidth = "1px";
            tempElement.style.borderStyle = "solid";
            tempElement.style.borderColor = "rgb(148 163 184 / 1))";
            tempElement.style.minWidth = "50px";
            tempElement.addEventListener("click", () => {
              selectIdea(i);
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
      setCaretToEnd(inputElement);
    }
  };

  const handleKeyDown = async (event: any, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputElement = document.getElementById(
        `idea-${index}`
      ) as HTMLDivElement;
      if (inputElement && inputElement.innerText.includes("<>")) {
        const tempIndex = 0; // update this from ui
        selectIdea(tempIndex);
      } else await addOption();
    }
    if (event.key === "Backspace") {
      event.preventDefault();
    }
  };

  const setCaretToEnd = (target: any) => {
    const range = document.createRange();
    const sel: any = window.getSelection();
    range.selectNodeContents(target);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    target.focus();
    range.detach();
    target.scrollTop = target.scrollHeight;
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
            onClick={() => console.log(choices, connectionList)}
          />
        </div>
        <input
          type="text"
          className="w-5/6 h-auto bg-transparent focus:outline-none text-2xl mb-4 border-b-2 border-solid border-blue-700 py-5 text-center text-white"
          placeholder="Search Ideas"
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
            className="absolute w-auto h-auto bg-white rounded-md px-4 py-3 hidden-scrollbar "
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
              <div key={`${value}-${index}`} className="w-full">
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
                >
                  <div className="h-3/6 flex flex-col justify-center border-r-2 border-solid border-blue-200 ">
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
                    className="px-1 mx-3 w-full h-[20px] text-white focus:outline-none text-2xl flex flex-row justify-start items-center whitespace-normal bg-transparent"
                    onInput={async (e) => await handleOnInput(e, index)}
                    onKeyDown={async (e) => await handleKeyDown(e, index)}
                  >
                    {choices[index]}
                    {connectionList[index] !== null ? (
                      <span className="highlight rounded-md px-2 ml-1">{`<>${
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

Test.defautlProps = {
  className: "",
};

export default Test;
