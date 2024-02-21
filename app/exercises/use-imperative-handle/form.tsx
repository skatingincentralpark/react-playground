"use client";
import {
  useRef,
  useState,
  useImperativeHandle,
  MouseEvent,
  useEffect,
  MutableRefObject,
} from "react";

type Api = {
  focus: () => void;
  shake: () => void;
};

type InputFieldProps = {
  onChange: (val: string) => void;
  apiRef: MutableRefObject<Api | null>;
};

const InputField = ({ onChange, apiRef }: InputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldShake, setShouldShake] = useState(false);

  useImperativeHandle(
    apiRef,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      shake: () => {
        setShouldShake(true);
      },
    }),

    []
  );

  useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        focus: () => {
          inputRef.current?.focus();
        },
        shake: () => {
          setShouldShake(true);
        },
      };
    }
  }, [apiRef]);

  const className = shouldShake ? "shake" : "";

  return (
    <input
      ref={inputRef}
      type="text"
      onChange={(e) => onChange(e.target.value)}
      className={`border rounded px-1 ${className}`}
      onAnimationEnd={() => {
        setShouldShake(false);
      }}
    />
  );
};

export default function Form() {
  const [name, setName] = useState("");
  const inputApiRef = useRef<Api>(null);

  const onSubmitClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!name) {
      inputApiRef.current?.focus();
      inputApiRef.current?.shake();
      console.log("Input should be focused and shaken if empty!");
    } else console.log("Submit the name here!", name);
  };

  return (
    <form className="border rounded flex gap-2 items-center p-2">
      <label>Name</label>
      <br />
      <InputField onChange={setName} apiRef={inputApiRef} />
      <button
        onClick={onSubmitClick}
        className="border rounded px-2"
        type="button"
      >
        Submit!
      </button>
    </form>
  );
}
