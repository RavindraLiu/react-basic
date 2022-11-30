export const REACT_TEXT = Symbol("react.text");
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? {
        type: REACT_TEXT,
        props: element,
      }
    : element;
}
