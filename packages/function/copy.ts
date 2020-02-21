const inputStyle = {
  opacity: "0",
  zIndex: "-100000",
  height: "1px",
  width: "1px",
  position: "absolute",
  left: "10000000px",
  top: "0",
  border: "none",
  padding: "0",
  margin: "0",
};

/**
 * @description 复制文本到剪切板上，由于浏览器的原因，需要在dom事件中执行该函数。
 * @param {string} text 要复制到剪切板上的文本 
 */
export default function copy(text:string) {
  let inputEle = document.createElement("input");
  Object.assign(inputEle.style, inputStyle);
  document.body.appendChild(inputEle);
  inputEle.value = text;
  inputEle.select();
  document.execCommand("copy");
  document.body.removeChild(inputEle);
}
