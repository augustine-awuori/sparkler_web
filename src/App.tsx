import { Route, Routes } from "react-router-dom";

import StartPage from "./views/StartPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
    </Routes>
  );
}

export default App;
