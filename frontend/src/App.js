import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import PaletteGenerator from "./components/PaletteGenerator";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaletteGenerator />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: false,
          className:
            "!bg-[#121212] !text-[#F4F3EE] !border !border-[#121212] !rounded-none !font-mono !text-xs !uppercase !tracking-widest",
        }}
      />
    </div>
  );
}

export default App;
