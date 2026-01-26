import Draggable from "react-draggable";
import { Link } from "react-router-dom";

function TaskCard({ task }) {
    return (
        <Draggable>
            <div className="task-card">
                <h4>{task.title}</h4>
                <p>Priority: {task.priority}</p>
                <Link to={`/task/${task.id}`}>Details</Link>
            </div>
        </Draggable>
    );
}

export default TaskCard;