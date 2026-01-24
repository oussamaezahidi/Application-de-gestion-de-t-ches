import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Kanban from "../src/features/pages/Kanban"
function App() {
  return (
<Router>
      <Routes>
        <Route path="/" element={<Kanban />} />



        </Routes>
    </Router>)
}

export default App;
