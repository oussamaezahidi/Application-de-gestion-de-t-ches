import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTaskByIdAPI, deleteTaskAPI } from "../tasks/tasksAPI";
import { fetchUsersAPI } from "../users/usersAPI";

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchTaskByIdAPI(id),
            fetchUsersAPI()
        ])
            .then(([taskRes, usersRes]) => {
                setTask(taskRes.data);
                setUsers(usersRes.data);
                setLoading(false);
            })
            .catch(() => {
                setTask(null);
                setLoading(false);
            });
    }, [id]);

    const getAssignedUser = () => {
        if (!task?.userId) return "Non assigné";
        const user = users.find(u => u.id == task.userId);
        return user?.username || "Non assigné";
    };

    const handleDelete = async () => {
        await deleteTaskAPI(task.id);
        navigate("/");
    };

    if (loading) return <p>Chargement...</p>;
    if (!task) return <p>Tâche introuvable</p>;

    return (
        <div>
            <h2>{task.title}</h2>

            <p><b>Description:</b> {task.description}</p>
            <p><b>Priorité:</b> {task.priority}</p>
            <p><b>Statut:</b> {task.status}</p>
            <p><b>Utilisateur assigné:</b> {getAssignedUser()}</p>

            <button onClick={() => navigate(`/task/${task.id}/edit`)}>
                Modifier
            </button>

            <button onClick={handleDelete}>
                Supprimer
            </button>
        </div>
    );
}

export default TaskDetails;
