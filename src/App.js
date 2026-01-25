import { BrowserRouter, Routes, Route } from "react-router-dom"
import Kanban from "./features/pages/Kanban"
import TaskDetails from "./features/pages/TaskDetails"
import TaskForm from "./features/pages/TaskForm"
import Users from "./features/pages/Users"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Kanban />} />
        <Route path="/tasks/new" element={<TaskForm mode="create" />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/task/:id/edit" element={<TaskForm mode="edit" />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
