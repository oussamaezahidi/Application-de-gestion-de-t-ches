import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask } from "../tasks/tasksSlice";
import { fetchUsers } from "../users/usersSlice";
import { selectAllTasks } from "../tasks/tasksSelectors";
import { selectAllUsers } from "../users/usersSelectors";

const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };
const PRIORITY_LABELS = { high: "Haute", medium: "Moyenne", low: "Faible" };
const TASK_STATUSES = [
    { key: "todo", label: "À faire" },
    { key: "in-progress", label: "En cours" },
    { key: "done", label: "Terminé" }
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
        const user = users.find(u => String(u.id) === String(userId));
        return user ? user.username : "Non attribué";
    };

    const getAvatar = (userId) => {
        const user = users.find(u => String(u.id) === String(userId));
        if (user) return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6c9eff&color=fff&size=64`;
        return `https://ui-avatars.com/api/?name=Non+attribu%C3%A9&background=EEEEEE&color=555&size=64
`;  
    }; 

    const getFilteredAndSortedTasks = (status) => {
        let filtered = allTasks.filter(t => t.status === status);
        
        if (filterUserId) {
            filtered = filtered.filter(t => String(t.userId) === String(filterUserId));
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
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        e.currentTarget && e.currentTarget.classList.add('drag-over');
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
        e.currentTarget && e.currentTarget.classList.remove('drag-over');
    };

    const handleDragEnd = (e) => {
        setDraggedTask(null);
        e.currentTarget && e.currentTarget.classList.remove('dragging');
    };

    if (loading) return <p>Chargement en cours...</p>;

    return (
        <div className="container">
            <div className="app-header">
                <div className="app-title">
                    <h1>Tableau Kanban</h1>
                </div>
                <div className="app-actions">
                    <button className="btn btn-primary" onClick={() => navigate("/task/new")}>Créer une tâche</button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/users")}>Gestion des utilisateurs</button>
                </div>
            </div>

            <div className="controls d-flex gap-3 mb-3 align-items-center">
                <div className="d-flex gap-2 align-items-center">
                    <label className="me-2 mb-0">Filtrer par utilisateur</label>
                    <select className="form-select" style={{width:220}} value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)}>
                        <option value="">Tous les utilisateurs</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <label className="me-2 mb-0">Trier par priorité</label>
                    <select className="form-select" style={{width:220}} value={sortPriority} onChange={(e) => setSortPriority(e.target.value)}>
                        <option value="">Aucun tri</option>
                        <option value="asc">Du plus élevé au plus bas</option>
                        <option value="desc">Du plus bas au plus élevé</option>
                    </select>
                </div>
            </div> 

            <div className="row">
                {TASK_STATUSES.map(status => (
                    <div className="col-md-4" key={status.key} onDragOver={handleDragOver} onDrop={(e) => handleDropEvent(e, status.key)}>
                        <div className="kanban-column">
                            <div className="column-title">{status.label}</div>

                            {getFilteredAndSortedTasks(status.key).length === 0 ? (
                                <p className="muted small">Aucune tâche à afficher</p>
                            ) : (
                                getFilteredAndSortedTasks(status.key).map((task) => (
                                    <div
                                        key={task.id}
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onDragEnd={handleDragEnd}
                                        className="task-card card"
                                    >
                                        <div className="card-body p-2">
                                            <strong>{task.title}</strong>
                                            <div className="task-meta mt-1">
                                                <div className="d-flex align-items-center gap-2">
                                                    <img src={getAvatar(task.userId)} alt="avatar" className="avatar" />
                                                    <span className="small">{getUsername(task.userId)}</span>
                                                </div>
                                                <span className={`priority priority-${task.priority}`}>{PRIORITY_LABELS[task.priority] || task.priority}</span>
                                            </div>

                                            <div className="mt-2 d-flex justify-content-between">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/tasks/${task.id}`)}>Voir les détails</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kanban;
