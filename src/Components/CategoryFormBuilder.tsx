/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineLightBulb, HiOutlineDuplicate } from "react-icons/hi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";

interface Props {
  className?: string;
  addCategoryQuestion(question: object): void;
}

const CategoryFormBuilder = ({ className, addCategoryQuestion }: Props) => {
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

  const addOption = () => {
    choices.push("");
    setAutofocusIndex(choices.length - 1);
    setChoices(choices);
    setToggle((prev) => (prev + 1) % 2);
  };

  const searchOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    choices.filter((idea) => idea.includes(searchString));
    setQuestion(templateQuestion);
  };

  const changeIdea = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputElement = e.target;
    const inputValue = inputElement.value;
    const highlightTag = "<>";
    const highlightIndex = inputValue.indexOf(highlightTag);

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
      textWidthPlaceholder.textContent = inputElement.value;
      const textWidth: number = textWidthPlaceholder.offsetWidth;

      setDropdownPosition([
        `${inputElement.getClientRects()["0"].top + 80}px`,
        `${textWidth + inputElement.getClientRects()["0"].left}px`,
      ]);
    } else {
      setDropdownPosition(["-2000px", "-2000px"]);
    }

    choices[index] = inputValue;
    setInputString(inputElement.value);
    setChoices(choices);
    setAutofocusIndex(index);
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
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      choices.splice(index + 1, 0, "");
      setChoices(choices);
      setAutofocusIndex(index + 1);
      setToggle((prev) => (prev + 1) % 2);
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
        className="absolute w-auto h-auto bg-white rounded-md px-4 py-3"
        style={{ top: dropdownPosition[0], left: dropdownPosition[1] }}
      >
        {choices
          .filter((idea) => idea !== inputString)
          .map((idea, index) => {
            return (
              <>
                <div key={index} className="mt-1 cursor-pointer">
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
          // onChange={searchOption}
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
                    {/* <span className="text-white">{index}</span> */}
                  </div>
                  {autofocusIndex === index ? (
                    <input
                      id={`idea-${index}`}
                      className="mx-3 w-full text-white bg-transparent h-full focus:outline-none text-3xl"
                      onChange={async (e) => await changeIdea(e, index)}
                      onKeyUp={(e) => keyEnter(e, index)}
                      disabled={false}
                      value={value}
                      autoFocus
                    />
                  ) : (
                    <input
                      id={`idea-${index}`}
                      className="mx-3 w-full text-white bg-transparent h-full focus:outline-none text-3xl"
                      onChange={async (e) => await changeIdea(e, index)}
                      onKeyUp={(e) => keyEnter(e, index)}
                      disabled={false}
                      value={value}
                    />
                  )}

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

CategoryFormBuilder.defautlProps = {
  className: "",
};

export default CategoryFormBuilder;
