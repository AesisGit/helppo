import { createElement as h, useRef, useEffect, useState } from "react";

const classNames = {
  wrapper: "boring-datepicker-wrapper",
  input: "boring-datepicker-input",
};

const dateRegex = /\d{4}-\d{2}-\d{2}/;

class BoOoOoringDatepicker {
  constructor(options) {
    this.options = Object.assign(
      {
        win: typeof window !== "undefined" ? window : undefined,
        existingWrapperElement: null,
        onChange: () => {},
      },
      options
    );

    this.addStylesheet();
    this.buildDom();
  }

  setValue(fullString) {
    const match = fullString.match(dateRegex);
    if (match) {
      this.fullValue = fullString;
      this.dateValue = match[0];
      this.dateInputElement.value = match[0];
    }
  }

  buildDom() {
    // DOM structure:
    //   <span class="datepicker-toggle">
    //     <!-- optional DOM nodes from user -->
    //     <input type="date" class="datepicker-input">
    //   </span>

    const wrapperElement =
      this.options.existingWrapperElement ||
      this.options.win.document.createElement("span");
    wrapperElement.classList.add(classNames.wrapper);

    if (!this.isSupported()) {
      // Not via CSS class because we don't want to mess with
      // CSS-set display values, to not mess up user styles
      wrapperElement.style.display = "none";
    }

    const dateInputElement = this.options.win.document.createElement("input");
    dateInputElement.type = "date";
    dateInputElement.classList.add(classNames.input);
    wrapperElement.appendChild(dateInputElement);
    this.dateInputElement = dateInputElement;

    dateInputElement.addEventListener("change", () => {
      let newValue = this.fullValue.replace(dateRegex, dateInputElement.value);
      // Regex didn't match, fallback to setting the entire value
      if (!newValue.includes(dateInputElement.value)) {
        newValue = dateInputElement.value;
      }
      dateInputElement.value = this.dateValue;
      this.options.onChange(newValue);
    });
  }

  addStylesheet() {
    if (!this.options.win.document.querySelector("style#boringDatepicker")) {
      const style = this.options.win.document.createElement("style");
      style.id = "boringDatepicker";
      style.textContent = `
        .${classNames.wrapper} {
          display: inline-block;
          position: relative;
        }
        .${classNames.input} {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          box-sizing: border-box;
        }
        .${classNames.input}::-webkit-calendar-picker-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }
      `;
      this.options.win.document.head.appendChild(style);
    }
  }

  isSupported() {
    const userAgent = this.options.win.navigator.userAgent.toLowerCase();
    const isDesktopSafari =
      !("ontouchstart" in this.options.win) &&
      userAgent.includes("safari") &&
      !userAgent.includes("chrome") &&
      !userAgent.includes("android");

    const isIe = typeof this.options.win.document.documentMode !== "undefined";

    return !isDesktopSafari && !isIe;
  }
}

const BoringDatepicker = ({ value, onChange, className = "", children }) => {
  const spanRef = useRef(null);
  const [datepicker, setDatepicker] = useState();
  useEffect(() => {
    if (spanRef.current) {
      const picker = new BoOoOoringDatepicker({
        existingWrapperElement: spanRef.current,
        onChange,
      });
      picker.setValue(value);
      setDatepicker(picker);
    }
  }, [spanRef.current]);
  useEffect(() => {
    if (datepicker) {
      datepicker.setValue(value);
    }
  }, [datepicker, value]);
  return h(
    "span",
    {
      ref: spanRef,
      className,
    },
    children
  );
};

export default BoringDatepicker;
