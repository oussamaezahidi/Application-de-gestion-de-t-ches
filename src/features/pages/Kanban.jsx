import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask } from "../tasks/tasksSlice";
import { fetchUsers } from "../users/usersSlice";
import { selectAllTasks } from "../tasks/tasksSelectors";
import { selectAllUsers } from "../users/usersSelectors";

const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };
const TASK_STATUSES = [
    { key: "todo", label: "To Do" },
    { key: "in-progress", label: "In Progress" },
    { key: "done", label: "Done" }
];

const Kanban = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [draggedTask, setDraggedTask] = useState(null);
    const [filterUserId, setFilterUserId] = useState("");
    const [sortPriority, setSortPriority] = useState("");

    const allTasks = useSelector(selectAllTasks);
    const users = useSelector(selectAllUsers);
    const tasksStatus = useSelector(state => state.tasks.status);
    const usersStatus = useSelector(state => state.users.status);
    const loading = tasksStatus === "loading" || usersStatus === "loading";

    useEffect(() => {
        if (tasksStatus === "idle") {
            dispatch(fetchTasks());
        }
        if (usersStatus === "idle") {
            dispatch(fetchUsers());
        }
    }, [dispatch, tasksStatus, usersStatus]);

    const getUsername = (userId) => {
        const user = users.find(u => u.id == userId);
        return user ? user.username : "Non assigné";
    };

    const getFilteredAndSortedTasks = (status) => {
        let filtered = allTasks.filter(t => t.status === status);
        
        if (filterUserId) {
            filtered = filtered.filter(t => t.userId == filterUserId);
        }
        
        if (sortPriority) {
            filtered = [...filtered].sort((a, b) => {
                const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
                return sortPriority === "asc" ? diff : -diff;
            });
        }
        
        return filtered;
    };

    const handleDragStart = (e, taskId) => {
        setDraggedTask(taskId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropEvent = (e, newStatus) => {
        e.preventDefault();
        if (draggedTask) {
            const task = allTasks.find(t => t.id === draggedTask);
            if (task) {
                dispatch(updateTask({ ...task, status: newStatus }));
            }
            setDraggedTask(null);
        }
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <div>
                <button onClick={() => navigate("/task/new")}>Ajouter Tâche</button>
                <button onClick={() => navigate("/users")}>Gérer Utilisateurs</button>
            </div>
            
            <div>
                <label>Filtrer par utilisateur: 
                    <select value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)}>
                        <option value="">-- Tous les utilisateurs --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </label>
                
                <label>Tri par priorité: 
                    <select value={sortPriority} onChange={(e) => setSortPriority(e.target.value)}>
                        <option value="">-- Pas de tri --</option>
                        <option value="asc">Haute → Basse</option>
                        <option value="desc">Basse → Haute</option>
                    </select>
                </label>
            </div>
            
            <table border="1">
                <thead>
                    <tr>
                        {TASK_STATUSES.map(status => (
                            <th key={status.key}>{status.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {TASK_STATUSES.map(status => (
                            <td
                                key={status.key}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropEvent(e, status.key)}
                            >
                                {getFilteredAndSortedTasks(status.key).length === 0 ? (
                                    <p>Aucune tâche</p>
                                ) : (
                                    getFilteredAndSortedTasks(status.key).map((task) => (
                                        <div
                                            key={task.id}
                                            draggable="true"
                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <strong>{task.title}</strong>
                                            <p>Priorité: {task.priority}</p>
                                            <p>Assigné à: {getUsername(task.userId)}</p>
                                            <button onClick={() => navigate(`/tasks/${task.id}`)}>Détails</button>
                                        </div>
                                    ))
                                )}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Kanban;
