import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTaskByIdAPI, addTaskAPI, updateTaskAPI } from "../tasks/tasksAPI";
import { fetchUsersAPI } from "../users/usersAPI";

const INITIAL_FORM_STATE = {
    title: "",
    description: "",
    priority: "medium",
    userId: "",
    status: "todo"
};

const PRIORITY_OPTIONS = [
    { value: "low", label: "Basse" },
    { value: "medium", label: "Moyenne" },
    { value: "high", label: "Haute" }
];

function TaskForm({ mode }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(mode === "edit");

    useEffect(() => {
        fetchUsersAPI()
            .then(res => setUsers(res.data))
            .catch(err => console.error("Erreur lors de la récupération des utilisateurs:", err));

        if (mode === "edit" && id) {
            fetchTaskByIdAPI(id)
                .then(res => {
                    setFormData(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [mode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateAndSubmit = async () => {
        if (!formData.title.trim()) {
            alert("Le titre est requis");
            return false;
        }

        try {
            if (mode === "create") {
                await addTaskAPI(formData);
            } else {
                await updateTaskAPI(formData);
            }
            navigate("/");
            return true;
        } catch (err) {
            console.error("Erreur:", err);
            alert("Erreur lors de l'enregistrement de la tâche");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await validateAndSubmit();
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <h2>{mode === "create" ? "Ajouter une tâche" : "Modifier la tâche"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Titre:</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Entrez le titre"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Entrez la description"
                        rows="4"
                    />
                </div>

                <div>
                    <label htmlFor="priority">Priorité:</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        {PRIORITY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="userId">Utilisateur assigné:</label>
                    <select
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                    >
                        <option value="">-- Sélectionner un utilisateur --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <button type="submit">
                        {mode === "create" ? "Ajouter" : "Modifier"}
                    </button>
                    <button type="button" onClick={() => navigate("/")}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
