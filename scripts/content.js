let targetJSON = null;

/** head modifiers **/

const importFonts = () => {
  const preconnectLinkNode1 = document.createElement("link");
  preconnectLinkNode1.rel = "preconnect";
  preconnectLinkNode1.href = "https://fonts.googleapis.com";

  const preconnectLinkNode2 = document.createElement("link");
  preconnectLinkNode2.rel = "preconnect";
  preconnectLinkNode2.href = "https://fonts.gstatic.com";
  preconnectLinkNode2.crossOrigin = true;

  const fontImportLinkNode = document.createElement("link");
  fontImportLinkNode.rel = "stylesheet";
  fontImportLinkNode.href =
    "https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@700&family=Fira+Code:wght@600&family=IBM+Plex+Mono:wght@500&family=Inconsolata:wght@500&family=JetBrains+Mono:wght@500&family=Roboto+Mono:wght@500&display=swap";

  document.head.appendChild(preconnectLinkNode1);
  document.head.appendChild(preconnectLinkNode2);
  document.head.appendChild(fontImportLinkNode);
};

const setStyles = () => {
  const styleNode = document.createElement("style");

  // Add some CSS rules to the <style> element
  styleNode.innerHTML = `
      html, select, button {
          background-color: #2E3440;
          color: #ECEFF4;
          font-family: "Roboto Mono", monospace;
          font-size: 16px;
          font-weight: 600;
      }
  
      .jsonContainer {
          margin: 0em .5em;
      }
  
      .header {
          margin: 10px 5px;
      }

      .header label, select, button {
          margin: 0em .25em;
      }
  
      label {
          color: #81A1C1;
      }
  
      button, select {
          border: #4C566A 1px solid;
          border-radius: 5px;
          padding: 5px 10px;
      }
  
      button:hover {
          color: #81A1C1;
          border-color: #81A1C1;
      }
  
      button:focus {
          color: #8FBCBB;
          border-color: #8FBCBB;
      }
  
      .nestedNode {
          display: flex;
          flex-direction: column;
          margin-top: .25em;
          margin-bottom: .25em;
          
          border-left: #4C566A 0.5px solid;
          margin-left: .25em;
          padding-left: .25em;
      }
  
      .hide {
          display: none;
      }
  
      .keyValuePairNode, .arrItemNode {
          padding: .1em 0em;
          margin-left: .5em;
      }
  
      .colonNode {
          margin-right: .5em;
      }
  
      .stringNode {
          color: #88C0D0;
      }
  
      .numberNode {
          color: #81A1C1;
      }
  
      .nullNode {
          color: #b48ead;
      }
  
      .keyNode {
          color: #8FBCBB;
      }
  
      .toggleNode {
          padding-left: .5em;
          padding-right: .5em;
          color: #999;
          font-weight: 400;
          font-size: .75em;
          border-width: 0px;
      }
    `;

  document.head.appendChild(styleNode);
};

/** Control Components **/

const fontSizeSlctOnChange = (event) =>
  (document.querySelector(".jsonContainer").style.fontSize =
    event.target.value);

const fontFamilySlctOnChange = (event) =>
  (document.querySelector(".jsonContainer").style.fontFamily =
    event.target.value);

const selectorNode = (options, selectedOption, onchange) => {
  const selectNode = document.createElement("select");
  selectNode.onchange = onchange;
  for (const option of options) {
    const optionNode = document.createElement("option");
    optionNode.textContent = option;
    if (option === selectedOption) {
      optionNode.selected = true;
    }
    selectNode.appendChild(optionNode);
  }
  return selectNode;
};

const copyButtonNode = () => {
  const copyButton = document.createElement("button");
  copyButton.appendChild(document.createTextNode("Copy"));
  copyButton.onblur = (event) => (event.target.childNodes[0].data = "Copy");
  copyButton.onclick = (event) => {
    navigator.clipboard
      .writeText(JSON.stringify(targetJSON, null, 2))
      .then(() => (event.target.childNodes[0].data = "Copied"))
      .catch((reason) => alert(reason));
  };
  return copyButton;
};

const controlsNode = () => {
  const controlsNode = document.createElement("div");
  controlsNode.className = "header";

  // Font size selector
  const fontSizeLabel = document.createElement("label");
  fontSizeLabel.innerText = "Font Size:";
  controlsNode.appendChild(fontSizeLabel);
  controlsNode.appendChild(
    selectorNode(["12px", "16px", "20px", "24px"], "16px", fontSizeSlctOnChange)
  );

  // Font family selector
  const fontFamilyLabel = document.createElement("label");
  fontFamilyLabel.innerText = "Font Family:";
  controlsNode.appendChild(fontFamilyLabel);
  controlsNode.appendChild(
    selectorNode(
      [
        "Anonymous Pro",
        "Courier New",
        "Fira Code",
        "IBM Plex Mono",
        "Inconsolata",
        "JetBrains Mono",
        "Roboto Mono",
        "monospace",
      ],
      "Roboto Mono",
      fontFamilySlctOnChange
    )
  );

  // copy button
  controlsNode.appendChild(copyButtonNode());

  return controlsNode;
};

/** JSON Components **/

const tokenNode = (token) => {
  const node = document.createElement("span");
  node.appendChild(document.createTextNode(token));
  return node;
};

const bracketNodes = (data) => {
  if (Array.isArray(data)) {
    return [tokenNode("["), tokenNode("]")];
  } else if (data !== null && typeof data === "object") {
    return [tokenNode("{"), tokenNode("}")];
  } else {
    return [null, null];
  }
};

const keyNode = (token) => {
  const spanNode = document.createElement("span");
  spanNode.appendChild(document.createTextNode(token));
  spanNode.className = "keyNode";
  return spanNode;
};

const arrayNode = (data) => {
  const arrNode = document.createElement("div");
  arrNode.className = "nestedNode";

  for (let el of data) {
    const arrItemNode = document.createElement("span");
    arrItemNode.className = "arrItemNode";

    const elNode = jsonNode(el);
    const [leftBracketNode, rightBracketNode] = bracketNodes(el);
    if (leftBracketNode) {
      arrItemNode.appendChild(leftBracketNode);
      arrItemNode.appendChild(toggleNode());
    }

    arrItemNode.appendChild(elNode);
    if (rightBracketNode) {
      arrItemNode.appendChild(rightBracketNode);
    }

    arrItemNode.appendChild(tokenNode(","));
    arrNode.appendChild(arrItemNode);
  }

  // remove comma
  if (arrNode.childNodes.length > 0) {
    const lastArrItemNode = arrNode.childNodes[arrNode.childNodes.length - 1];
    const commaNode =
      lastArrItemNode.childNodes[lastArrItemNode.childNodes.length - 1];
    lastArrItemNode.removeChild(commaNode);
  }

  return arrNode;
};

const objectNode = (data) => {
  const objNode = document.createElement("div");
  objNode.className = "nestedNode";

  for (let [key, value] of Object.entries(data)) {
    const kvNode = document.createElement("span");
    kvNode.className = "keyValuePairNode";
    kvNode.appendChild(keyNode(`"${key}"`));
    const colonNode = tokenNode(":");
    colonNode.className = "colonNode";
    kvNode.appendChild(colonNode);
    const valueNode = jsonNode(value);

    const [leftBracketNode, rightBracketNode] = bracketNodes(value);
    if (leftBracketNode) {
      leftBracketNode.className = "openBracketNode";
      kvNode.appendChild(leftBracketNode);
      kvNode.appendChild(toggleNode());
    }

    kvNode.appendChild(valueNode);
    if (rightBracketNode) {
      kvNode.appendChild(rightBracketNode);
    }

    kvNode.appendChild(tokenNode(","));
    objNode.appendChild(kvNode);
  }

  // remove comma
  if (objNode.childNodes.length > 0) {
    const lastKVNode = objNode.childNodes[objNode.childNodes.length - 1];
    const commaNode = lastKVNode.childNodes[lastKVNode.childNodes.length - 1];
    lastKVNode.removeChild(commaNode);
  }

  return objNode;
};

const stringNode = (data) => {
  const node = document.createElement("span");
  node.appendChild(document.createTextNode(`"${data}"`));
  node.className = "stringNode";
  return node;
};

const numberNode = (data) => {
  const node = document.createElement("span");
  node.appendChild(document.createTextNode(`${data}`));
  node.className = "numberNode";
  return node;
};

const nullNode = () => {
  const node = document.createElement("span");
  node.appendChild(document.createTextNode("null"));
  node.className = "nullNode";
  return node;
};

const toggleNode = () => {
  const node = document.createElement("button");
  node.className = "toggleNode";
  node.appendChild(document.createTextNode("[-]"));
  node.onclick = (ev) => {
    const kvNode = ev.target.parentNode.querySelector(".nestedNode");
    if (!kvNode.classList.contains("hide")) {
      kvNode.classList.add("hide");
      ev.target.childNodes[0].data = "[+]";
    } else {
      kvNode.classList.remove("hide");
      ev.target.childNodes[0].data = "[-]";
    }
  };
  return node;
};

const jsonNode = (data) => {
  let node = null;
  if (Array.isArray(data)) {
    node = arrayNode(data);
  } else if (data === null) {
    node = nullNode();
  } else if (typeof data === "object") {
    node = objectNode(data);
  } else if (typeof data === "string") {
    node = stringNode(data);
  } else if (typeof data === "number") {
    node = numberNode(data);
  } else {
    throw "unexpected type";
  }
  return node;
};

const jsonContainerNode = (data) => {
  const jsonContainerNode = document.createElement("div");
  jsonContainerNode.className = "jsonContainer";
  const [leftBracketNode, rightBracketNode] = bracketNodes(data);
  jsonContainerNode.appendChild(leftBracketNode);
  jsonContainerNode.appendChild(toggleNode());
  jsonContainerNode.appendChild(jsonNode(data));
  jsonContainerNode.appendChild(rightBracketNode);
  return jsonContainerNode;
};

const renderView = () => {
  const bodyNode = document.querySelector("body");
  try {
    targetJSON = JSON.parse(bodyNode.textContent);
  } catch {
    console.log("not a json page");
  }

  if (targetJSON) {
    // clear body
    bodyNode.childNodes.forEach((child) => {
      bodyNode.removeChild(child);
    });

    importFonts();
    setStyles();
    bodyNode.appendChild(controlsNode());
    bodyNode.appendChild(jsonContainerNode(targetJSON));
  }
};

renderView();
