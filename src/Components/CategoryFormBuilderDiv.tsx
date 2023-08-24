/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineLightBulb, HiOutlineDuplicate } from "react-icons/hi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import Basic from "./Basic";

interface Props {
  className?: string;
  addCategoryQuestion(question: object): void;
}

const CategoryFormBuilderDiv = ({ className, addCategoryQuestion }: Props) => {
  const [choices, setChoices] = useState<string[]>([]);
  const [inputString, setInputString] = useState<string>("");
  const [autofocusIndex, setAutofocusIndex] = useState<number>(0);
  const [connectionJSON, setConnectionJSON] = useState<object>({});
  const [dropdownPosition, setDropdownPosition] = useState<string[]>([
    "-2000px",
    "-2000px",
  ]);
  interface TProps {
    questionStatement: string | null;
    choices: string[];
    categories: string[];
    answer: object;
  }
  const templateQuestion: TProps = {
    questionStatement: null,
    choices: [],
    categories: [],
    answer: {},
  };
  const [question, setQuestion] = useState(templateQuestion);
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
    setToggle((prev) => (prev + 1) % 2);
  };

  const addOption = async () => {
    choices.push("");
    setAutofocusIndex(choices.length - 1);
    setChoices(choices);
    setTimeout(() => {
      const inputElement = document.getElementById(
        `idea-${autofocusIndex}`
      ) as HTMLDivElement;
      if (inputElement) inputElement.focus();
    }, 50);
    setToggle((prev) => (prev + 1) % 2);
  };

  const closeOption = (index: number) => {
    setChoices(choices.filter((item, i) => i !== index));
    setAutofocusIndex(index === 0 ? index : index - 1);
    setToggle((prev) => (prev + 1) % 2);
  };

  const duplicateIdea = (index: number) => {
    choices.splice(
      index + 1,
      0,
      (document.getElementById(`idea-${index}`) as HTMLInputElement).value
    );
    setChoices(choices);
    setAutofocusIndex(index + 1);
    setToggle((prev) => (prev + 1) % 2);
  };

  const keyEnter = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    const inputElement = document.getElementById(
      `idea-${index}`
    ) as HTMLDivElement;
    const highlightTag = "<>";
    const inputValue = inputElement.innerText;
    const highlightIndex = inputValue.indexOf(highlightTag);

    console.log(e.key, highlightIndex, choices);
    if (
      highlightIndex !== -1 &&
      choices.filter((idea) => idea !== inputString).length !== 0
    ) {
      const highlightedText = inputValue.substring(highlightIndex + 2);
      if (highlightedText !== "") {
      }
      const textWidthPlaceholder: HTMLDivElement = document.getElementById(
        "textWidthPlaceholder"
      ) as HTMLDivElement;
      textWidthPlaceholder.textContent = inputElement.innerText;
      const textWidth: number = textWidthPlaceholder.offsetWidth;

      setDropdownPosition([
        `${inputElement.getClientRects()["0"].top + 80}px`,
        `${textWidth + inputElement.getClientRects()["0"].left}px`,
      ]);
    } else {
      setDropdownPosition(["-2000px", "-2000px"]);
    }

    if (e.key === "Enter") {
      choices.splice(index + 1, 0, "");
      setChoices(choices);
      setAutofocusIndex(index + 1);
      setTimeout(() => {
        const inputElement = document.getElementById(
          `idea-${index + 1}`
        ) as HTMLDivElement;
        if (inputElement) inputElement.focus();
      }, 50);
      setToggle((prev) => (prev + 1) % 2);
    }

    choices[index] = inputValue;
    setInputString(inputElement.innerText);
    setChoices(choices);
    setAutofocusIndex(index);
    setTimeout(() => {
      const inputElement = document.getElementById(
        `idea-${index}`
      ) as HTMLDivElement;
      if (inputElement) {
        //inputElement.focus();
        setCaretToEnd(inputElement);
      }
    }, 13);
    setToggle((prev) => (prev + 1) % 2);
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

  const selectIdea = () => {};

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
        className="absolute w-auto h-auto bg-white rounded-md px-4 py-3"
        style={{ top: dropdownPosition[0], left: dropdownPosition[1] }}
      >
        {choices.map((idea, index) => {
          if (idea === inputString) return null;
          return (
            <>
              <div
                key={index}
                className="mt-1 cursor-pointer w-full  border-b-2 border-solid border-slate-400"
                onClick={() => selectIdea()}
              >
                {idea}
              </div>
              <div className="w-auto border-b-2 border-solid border-slate-400"></div>
            </>
          );
        })}
      </div>
      <div
        id="cat-q"
        className="flex flex-row w-full justify-center items-center"
      >
        <div className="text-blue-200 mr-5">
          <HiOutlineLightBulb size={37} />
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
                  className="w-auto h-28 border-2 border-solid border-blue-200 items-center pl-3 pr-5 flex flex-row justify-start rounded-md hover:bg-slate-700 cursor-pointer"
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
                    contentEditable={true}
                    role="textbox"
                    className="input-div"
                    onKeyUp={(e) => keyEnter(e, index)}
                  >
                    <p>{value}</p>
                  </div>
                  {/* <Basic /> */}
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

CategoryFormBuilderDiv.defautlProps = {
  className: "",
};

export default CategoryFormBuilderDiv;
