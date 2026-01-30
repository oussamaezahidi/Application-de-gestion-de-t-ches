import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsersAPI, addUserAPI, deleteUserAPI } from "../users/usersAPI";
import { fetchTasksAPI, updateTaskAPI } from "../tasks/tasksAPI";

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        Promise.all([
            fetchUsersAPI(),
            fetchTasksAPI()
        ])
            .then(([usersRes, tasksRes]) => {
                setUsers(usersRes.data);
                setTasks(tasksRes.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 3000);
    };

    const createNewUser = async (username) => {
        return addUserAPI({
            username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=EEEEEE&color=555&size=64`
        });
    };

    const reassignUserTasks = async (userId) => {
        const userTasks = tasks.filter(t => String(t.userId) === String(userId));
        for (let task of userTasks) {
            await updateTaskAPI({ ...task, userId: "" });
        }
        return userTasks;
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!newUsername.trim()) {
            showMessage("Le nom d'utilisateur est requis.");
            return;
        }

        try {
            const res = await createNewUser(newUsername);
            setUsers([...users, res.data]);
            setNewUsername("");
            showMessage("Utilisateur créé avec succès.");
        } catch (err) {
            showMessage("Impossible d'ajouter l'utilisateur. Veuillez réessayer.");
        }
    };

    const handleDeleteUser = async (userId) => {
        const userTasks = tasks.filter(t => String(t.userId) === String(userId));

        if (userTasks.length > 0) {
            const confirmAction = window.confirm(
                `Cet utilisateur est assigné à ${userTasks.length} tâche(s). Confirmez-vous la suppression et le retrait des assignations ?`
            );

            if (!confirmAction) return;

            try {
                await reassignUserTasks(userId);
                await deleteUserAPI(userId);
                setUsers(users.filter(u => u.id !== userId));
                setTasks(tasks.map(t => String(t.userId) === String(userId) ? { ...t, userId: "" } : t));
                showMessage("Utilisateur supprimé. Assignations mises à jour.");
            } catch (err) {
                showMessage("Erreur lors de la suppression");
            }
        } else {
            try {
                await deleteUserAPI(userId);
                setUsers(users.filter(u => u.id !== userId));
                showMessage("Utilisateur supprimé.");
            } catch (err) {
                showMessage("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <p>Chargement en cours...</p>;

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Gestion des utilisateurs</h2>
                <button className="btn btn-secondary" onClick={() => navigate("/")}>Retour au tableau</button>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="card form-card mb-4">
                <div className="card-body">
                    <h5>Créer un utilisateur</h5>
                    <form className="d-flex gap-2" onSubmit={handleAddUser}>
                        <input
                            className="form-control"
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Nom d'utilisateur"
                        />
                        <button className="btn btn-primary" type="submit">Créer</button>
                    </form>
                </div>
            </div>

            <div>
                <h3>Utilisateurs</h3>
                {users.length === 0 ? (
                    <p>Aucun utilisateur trouvé.</p>
                ) : (
                    <div className="users-list list-group">
                        {users.map(user => {
                            const userTaskCount = tasks.filter(t => String(t.userId) === String(user.id)).length;
                            const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6c9eff&color=fff&size=64`; 
                            return (
                                <div key={user.id} className="user-row list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={avatarSrc} alt={user.username} className="avatar rounded-circle" />
                                        <div>
                                            <div className="username">{user.username}</div>
                                            <div className="small muted">{userTaskCount} {userTaskCount === 1 ? 'tâche' : 'tâches'}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user.id)}>Supprimer l'utilisateur</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
