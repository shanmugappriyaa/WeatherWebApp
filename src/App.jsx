import "./App.css";
import Weather from "./Components/Weather";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center my-3">
        <h4>Weather Forecasting</h4>
      </div>
      <Weather />
    </>
  );
}

export default App;
