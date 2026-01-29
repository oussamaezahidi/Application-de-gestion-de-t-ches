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
            avatar: `https://ui-avatars.com/api/?name=${username}`
        });
    };

    const reassignUserTasks = async (userId) => {
        const userTasks = tasks.filter(t => t.userId == userId);
        for (let task of userTasks) {
            await updateTaskAPI({ ...task, userId: "" });
        }
        return userTasks;
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!newUsername.trim()) {
            showMessage("Le nom d'utilisateur est requis");
            return;
        }

        try {
            const res = await createNewUser(newUsername);
            setUsers([...users, res.data]);
            setNewUsername("");
            showMessage("Utilisateur ajouté avec succès");
        } catch (err) {
            showMessage("Erreur lors de l'ajout de l'utilisateur");
        }
    };

    const handleDeleteUser = async (userId) => {
        const userTasks = tasks.filter(t => t.userId == userId);

        if (userTasks.length > 0) {
            const confirmAction = window.confirm(
                `Cet utilisateur est assigné à ${userTasks.length} tâche(s).\nVoulez-vous retirer l'assignation de ces tâches?`
            );

            if (!confirmAction) return;

            try {
                await reassignUserTasks(userId);
                await deleteUserAPI(userId);
                setUsers(users.filter(u => u.id !== userId));
                setTasks(tasks.map(t => t.userId == userId ? { ...t, userId: "" } : t));
                showMessage("Utilisateur supprimé et assignations retirées");
            } catch (err) {
                showMessage("Erreur lors de la suppression");
            }
        } else {
            try {
                await deleteUserAPI(userId);
                setUsers(users.filter(u => u.id !== userId));
                showMessage("Utilisateur supprimé");
            } catch (err) {
                showMessage("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <button onClick={() => navigate("/")}>Retour à Kanban</button>

            <h2>Gestion des utilisateurs</h2>

            {message && <p>{message}</p>}

            <div>
                <h3>Ajouter un utilisateur</h3>
                <form onSubmit={handleAddUser}>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Nom d'utilisateur"
                    />
                    <button type="submit">Ajouter</button>
                </form>
            </div>

            <div>
                <h3>Liste des utilisateurs</h3>
                {users.length === 0 ? (
                    <p>Aucun utilisateur</p>
                ) : (
                    <ul>
                        {users.map(user => {
                            const userTaskCount = tasks.filter(t => t.userId == user.id).length;
                            return (
                                <li key={user.id}>
                                    <strong>{user.username}</strong>
                                    {userTaskCount > 0 && <span> ({userTaskCount} tâche(s))</span>}
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Users;
