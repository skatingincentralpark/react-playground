"use client";
import Form from "./form";

import "./styles.css";

export default function Page() {
  return (
    <div className="App">
      <p>Click submit and see how `name` field focuses!</p>
      <Form />
    </div>
  );
}
