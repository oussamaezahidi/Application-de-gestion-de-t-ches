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

    const getAvatarPreview = () => {
        const user = users.find(u => String(u.id) === String(formData.userId));
        if (user) return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6c9eff&color=fff&size=128`;
        return `https://ui-avatars.com/api/?name=Non+attribu%C3%A9&background=EEEEEE&color=555&size=64`;  
    };

    const validateAndSubmit = async () => {
        if (!formData.title.trim()) {
            alert("Le titre est obligatoire.");
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
            alert("Impossible d'enregistrer la tâche. Veuillez réessayer.");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await validateAndSubmit();
    };

    if (loading) return <p>Chargement en cours...</p>;

    return (
        <div className="container">
            <div className="card form-card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">{mode === "create" ? "Créer une tâche" : "Modifier la tâche"}</h4>
                        <div>
                            <button className="btn btn-secondary me-2" onClick={() => navigate("/")}>Annuler</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>{mode === "create" ? "Créer" : "Mettre à jour"}</button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Titre</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Titre de la tâche"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description de la tâche"
                                rows="4"
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="priority" className="form-label">Priorité</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className="form-select"
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

                            <div className="col-md-4 mb-3">
                                <label htmlFor="userId" className="form-label">Utilisateur assigné</label>
                                <select
                                    id="userId"
                                    name="userId"
                                    className="form-select"
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

                            <div className="col-md-4 mb-3 d-flex flex-column align-items-center justify-content-center">
                                <label className="form-label mb-2">Aperçu avatar</label>
                                <img src={getAvatarPreview()} alt="avatar-preview" className="avatar" />
                            </div>
                        </div>

                        <input type="hidden" name="status" value={formData.status} />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TaskForm;
