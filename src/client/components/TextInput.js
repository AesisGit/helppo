import classNames from "classnames";
import { createElement as h, forwardRef } from "react";

const TextInput = forwardRef(
  (
    {
      value,
      type,
      disabled,
      placeholder,
      slim,
      size,
      multiLine,
      textAlignCenter,
      danger,
      onChange,
      onBlur,
      autoFocus,
      ...rest
    },
    ref
  ) => {
    const tagName = multiLine ? "textarea" : "input";
    const props = {
      className: classNames(
        "TextInput",
        slim && "TextInput--slim",
        multiLine && "TextInput--multiLine",
        textAlignCenter && "TextInput--textAlignCenter",
        danger && "TextInput--danger"
      ),
      disabled,
      autoFocus,
      defaultValue: value,
      placeholder: placeholder || "",
      type: type || "text",
      ...rest,
      ref,
    };

    if (onChange) {
      delete props.defaultValue;
      props.value = value;
      props.onChange = (event) => {
        onChange(event.target.value);
      };
    }

    if (onBlur) {
      props.onBlur = (event) => {
        onBlur(event.target.value);
      };
    }

    if (size) {
      const padding = 2 * (slim ? 4 : 8);
      props.style = {
        width: size * 8 + padding,
      };
    }
    return h(tagName, props);
  }
);

export default TextInput;
