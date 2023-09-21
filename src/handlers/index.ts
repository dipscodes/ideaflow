const saveChoices = (strings?: string[]) => {
  localStorage.setItem("choices", JSON.stringify(strings));
};

const saveConnectionList = (numbers?: number[]) => {
  localStorage.setItem("connections", JSON.stringify(numbers));
};

const moveElementIndexToIndex = (
  array: string[],
  sourceIndex: number,
  destinationIndex: number
): [string, number][] => {
  let copyList: [string, number][] = [];
  for (let i = 0; i < array.length; i++) {
    copyList.push([array[i], i]);
  }
  const removedElement = copyList.splice(sourceIndex, 1)[0];
  copyList.push(removedElement);
  let dIndex = destinationIndex;
  sourceIndex > destinationIndex
    ? (dIndex = destinationIndex + 1)
    : (dIndex = destinationIndex);
  if (dIndex >= copyList.length) dIndex = copyList.length - 1;
  copyList.splice(dIndex, 0, copyList.pop() as [string, number]);
  return copyList;
};

const moveConnectionsIndexToIndex = (
  array: number[],
  sourceIndex: number,
  destinationIndex: number
): number[] => {
  var copyList = [...array];
  var removedElement = copyList.splice(sourceIndex, 1)[0];
  copyList.push(removedElement);
  let dIndex = destinationIndex;
  sourceIndex > destinationIndex
    ? (dIndex = destinationIndex + 1)
    : (dIndex = destinationIndex);
  if (dIndex >= copyList.length) dIndex = copyList.length - 1;
  copyList.splice(dIndex, 0, copyList.pop() as number);
  return copyList;
};

const dragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
  e.dataTransfer.setData("index", `${index}`);
  e.dataTransfer.setData("enter", "false");
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

const handleDragDrop = (
  e: React.DragEvent<HTMLDivElement>,
  index: number,
  choices: string[],
  connectionList: number[]
): [string[], number[]] => {
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

  // setChoices(extractedChoices);
  // setConnectionList(extractedConnections);
  saveChoices(extractedChoices);
  saveConnectionList(extractedConnections);
  // setToggle((prev) => (prev + 1) % 2);
  return [extractedChoices, extractedConnections];
};

const handleAddOption = async (
  choices: string[],
  connectionList: number[]
): Promise<[string[], number[]]> => {
  const tempChoices = [...choices, ""];
  const tempConnections = connectionList;
  tempConnections[tempChoices.length - 1] = -1;
  setTimeout(() => {
    const inputElement = document.getElementById(
      `idea-${tempChoices.length - 1}`
    ) as HTMLDivElement;
    if (inputElement) setCaretToEnd(inputElement);
  }, 50);
  saveChoices(tempChoices);
  saveConnectionList(tempConnections);
  return [tempChoices, tempConnections];
};

const handleCloseOption = (
  index: number,
  choices: string[],
  connectionList: number[]
): [string[], number[]] => {
  const tempChoices = choices.filter((item, i) => i !== index);
  const tempConnections = connectionList
    .filter((item, i) => i !== index)
    .map((value: number, i: number) => {
      if (value === index) return -1;
      if (value > index && value !== -1) return value - 1;
      return value;
    });
  saveChoices(tempChoices);
  saveConnectionList(tempConnections);
  return [tempChoices, tempConnections];
};

const handleDuplicateIdea = (
  index: number,
  choices: string[],
  connectionList: number[]
): [string[], number[]] => {
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
      .map((value) => (value !== -1 && value > index + 1 ? value + 1 : value));
  } else {
    tempChoices = [...choices, choices[index]];
    tempConnections = [...connectionList, -1];
  }
  setTimeout(() => {
    const inputElement = document.getElementById(
      `idea-${index + 1}`
    ) as HTMLDivElement;
    if (inputElement) setCaretToEnd(inputElement);
  }, 50);
  saveChoices(tempChoices);
  saveConnectionList(tempConnections);
  return [tempChoices, tempConnections];
};

const handleSelectIdea = (
  index: number,
  focusIndex: number,
  choices: string[],
  connectionList: number[]
): number[] | null => {
  const tempChoices = [...choices];
  const tempConnections = [...connectionList];
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
      tempChoices[index]
    }</span>`;
    inputElement.innerHTML = formattedText;
    tempConnections[focusIndex] = index;
    const textWidthPlaceholder: HTMLDivElement = document.getElementById(
      "textWidthPlaceholder"
    ) as HTMLDivElement;
    const dropdown: HTMLDivElement = document.getElementById(
      "idea-dropdown"
    ) as HTMLDivElement;
    textWidthPlaceholder.textContent = inputElement.innerText;
    dropdown.style.top = `-2000px`;
    dropdown.style.left = `-2000px`;
    saveChoices();
    saveConnectionList(tempConnections);
    setCaretToEnd(inputElement);

    return tempConnections;
  }
  return null;
};

const moveStringsToStart = (strs: string[], s1: string) => {
  const matchingStrings: [string, number][] = [];
  const semiMatchingStrings: [string, number][] = [];
  const nonMatchingStrings: [string, number][] = [];

  for (let i = 0; i < strs.length; i++) {
    if (strs[i].startsWith(s1)) {
      matchingStrings.push([strs[i], i]);
    } else if (strs[i].includes(s1)) {
      semiMatchingStrings.push([strs[i], i]);
    } else {
      nonMatchingStrings.push([strs[i], i]);
    }
  }

  return matchingStrings.concat(semiMatchingStrings).concat(nonMatchingStrings);
};

const handleOnInput = (
  e: any,
  index: number,
  choices: string[],
  connectionList: number[]
): string[] | null => {
  const inputElement = document.getElementById(
    `idea-${index}`
  ) as HTMLDivElement;
  const tempChoice = [...choices];

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
          if (i === 0) tempElement.style.backgroundColor = "rgb(8 145 178 / 1)";
          tempElement.addEventListener("click", () => {
            handleSelectIdea(element[1], index, tempChoice, connectionList);
          });
          dropdown.append(tempElement);
        }
      });
      dropdown.style.top = `${inputElement.getClientRects()["0"].top + 30}px`;
      dropdown.style.left = `${
        textWidth + inputElement.getClientRects()["0"].left - 10
      }px`;
    }
    // saveChoices(tempChoice);
    // setCaretToEnd(inputElement);
    return tempChoice;
  }
  return null;
};

const handleKeyDown = async (
  event: any,
  index: number,
  choices: string[],
  connectionList: number[]
): Promise<boolean | number[] | null> => {
  if (event.key === "Space") {
    event.preventDefault();
    const inputElement = document.getElementById(
      `idea-${index}`
    ) as HTMLDivElement;
    setCaretToEnd(inputElement);
    return null;
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
      handleSelectIdea(tempIndex, index, choices, connectionList);
    } else {
      await handleAddOption(choices, connectionList);
      return true;
    }
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
        const tempChoices = [...choices];
        const tempConnections = [...connectionList];
        inputElement.innerHTML = tempChoices[index];
        tempConnections[index] = -1;
        // setConnectionList(tempConnections);
        setCaretToEnd(inputElement);
        saveConnectionList(tempConnections);
        const dropdown: HTMLDivElement = document.getElementById(
          "idea-dropdown"
        ) as HTMLDivElement;
        dropdown.style.top = `-2000px`;
        dropdown.style.left = `-2000px`;
        return tempConnections;
      } else {
        spanELement.setAttribute("data-delete", "true");
        spanELement.style.backgroundColor = "gray ";
      }
    }
  }
  return null;
};

const handleSearchIdeas = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputDivElements = document.getElementsByClassName(
    "search-selection"
  ) as HTMLCollectionOf<Element>;
  if (inputDivElements) {
    for (let i = 0; i < inputDivElements.length; i++) {
      const singleDiv = inputDivElements[i].querySelector(
        'div[contenteditable="true"]'
      );
      if (
        singleDiv?.innerHTML
          .replace(/<span.*?<\/span>/, "")
          .includes(e.target.value) &&
        e.target.value !== ""
      ) {
        inputDivElements[i].removeAttribute("hidden");
      } else {
        inputDivElements[i].setAttribute("hidden", "hidden");
      }
      if (e.target.value === "") inputDivElements[i].removeAttribute("hidden");
    }
  }
};

const setCaretToEnd = (target: HTMLDivElement) => {
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

export {
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
  handleDragDrop,
  handleAddOption,
  handleCloseOption,
  handleDuplicateIdea,
  handleSelectIdea,
  handleSearchIdeas,
  handleOnInput,
  handleKeyDown,
};
