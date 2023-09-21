import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineLightBulb, HiOutlineDuplicate } from "react-icons/hi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import {
  setCaretToEnd,
  dragStart,
  dragEnter,
  dragLeave,
  dragOver,
  handleDragDrop,
  handleAddOption,
  handleDuplicateIdea,
  handleSearchIdeas,
  handleCloseOption,
  handleOnInput,
  saveChoices,
  handleKeyDown,
} from "../handlers";

interface Props {
  className?: string;
}

const IdeaBuilder = ({ className }: Props) => {
  const [choices, setChoices] = useState<string[]>([]);
  const [connectionList, setConnectionList] = useState<number[]>([]);
  const [toggle, setToggle] = useState<number>(0);

  useEffect(() => {
    // localStorage.removeItem("choices");
    // localStorage.removeItem("connections");
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
    const [extractedChoices, extractedConnections] = handleDragDrop(
      e,
      index,
      choices,
      connectionList
    );

    setChoices(extractedChoices);
    setConnectionList(extractedConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const addOption = async () => {
    const [extractedChoices, extractedConnections] = await handleAddOption(
      choices,
      connectionList
    );

    setChoices(extractedChoices);
    setConnectionList(extractedConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const closeOption = (index: number) => {
    const [extractedChoices, extractedConnections] = handleCloseOption(
      index,
      choices,
      connectionList
    );
    setChoices(extractedChoices);
    setConnectionList(extractedConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const duplicateIdea = (index: number) => {
    const [extractedChoices, extractedConnections] = handleDuplicateIdea(
      index,
      choices,
      connectionList
    );
    setChoices(extractedChoices);
    setConnectionList(extractedConnections);
    setToggle((prev) => (prev + 1) % 2);
  };

  const onIdeaInput = async (e: any, index: number) => {
    const result = handleOnInput(e, index, choices, connectionList);

    if (result) {
      saveChoices(result);
      setChoices(result);

      setTimeout(() => {
        setCaretToEnd(
          document.getElementById(`idea-${index}`) as HTMLDivElement
        );
      }, 10);
    }
  };

  const onIdeaKeyDown = async (
    e: any,
    index: number,
    choices: string[],
    connectionList: number[]
  ) => {
    const result = await handleKeyDown(e, index, choices, connectionList);
    if (result) {
      if (result === true) await addOption();
      if (Array.isArray(result)) setConnectionList(result);
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
          onChange={(e) => handleSearchIdeas(e)}
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
                      ) as HTMLDivElement
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
                    onInput={async (e) => await onIdeaInput(e, index)}
                    onKeyDown={async (e) =>
                      await onIdeaKeyDown(e, index, choices, connectionList)
                    }
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
