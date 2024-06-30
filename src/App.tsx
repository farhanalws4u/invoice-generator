import "./App.css";
import Form from "./Components/Form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Template from "./Components/Template";
import { useState } from "react";
import { invoiceContext } from "./context/invoiceData";

function App() {
  const [invoiceDataContext, setInvoiceDataContext] = useState({});
  return (
    <div>
      <invoiceContext.Provider
        /* @ts-ignore */
        value={{ invoiceDataContext, setInvoiceDataContext }}
      >
        <Router>
          <Routes>
            {/* @ts-ignore */}
            <Route exact path="/" Component={Form} />
            {/* @ts-ignore */}
            <Route exact path="/template" Component={Template} />
          </Routes>
        </Router>
      </invoiceContext.Provider>
    </div>
  );
}

export default App;
