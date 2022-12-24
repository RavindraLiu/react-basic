import { REACT_TEXT } from "./constants";
// 无论是什么元素都统一转换为对象类型的元素
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? {
        type: REACT_TEXT,
        props: {
          content: element,
        },
      }
    : element;
}
