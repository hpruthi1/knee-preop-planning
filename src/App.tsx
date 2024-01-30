import { useRoutes } from "react-router-dom";
import "./App.css";
import routes from "./routes/Routes";

function App() {
  const component = useRoutes(routes);
  return component;
}

export default App;
