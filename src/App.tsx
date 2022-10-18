import type { Component } from "solid-js";

import Notifications from "./Components/Notifications";

const App: Component = () => {
  return (
    <div class="grid h-screen place-items-center bg-c-very-light-grayish-blue">
      <Notifications />
    </div>
  );
};

export default App;
