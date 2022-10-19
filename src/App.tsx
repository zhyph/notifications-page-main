import type { Component } from "solid-js";

import Notifications from "./Components/Notifications";

const App: Component = () => {
  return (
    <div class="grid h-screen place-items-center bg-c-very-light-grayish-blue">
      <Notifications />
      <div class="bottom-1 text-xs md:absolute">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
          Frontend Mentor.
        </a>
        &nbsp;Coded by{" "}
        <a
          href="https://www.linkedin.com/in/artur-almeida-61ab6a1b4/"
          target="_blank"
        >
          Artur Almeida Junior
        </a>
        .
      </div>
    </div>
  );
};

export default App;
