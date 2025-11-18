import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default App;
