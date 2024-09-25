import { BrowserRouter, Route, Routes } from "react-router-dom";

import Enter from "./views/Enter";
import MatrixView from "./views/MatrixView";
import LimitEnter from "./views/LimitEnter";

import { ToastNotification } from "./components/common/ToastNotification";

import { MatrixProvider } from "./providers/MatrixProvider";

const App = () => {
  return (
    <>
      <ToastNotification />
          <MatrixProvider>
              <BrowserRouter basename="/">
                  <Routes>
                      <Route path="/" element={<Enter/>}/>
                      <Route path="/enter-limit" element={<LimitEnter/>}/>
                      <Route path="/matrix" element={<MatrixView/>}/>
                  </Routes>
              </BrowserRouter>
          </MatrixProvider>
      </>
  )
}

export default App;
