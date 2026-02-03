import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTaskByIdAPI, deleteTaskAPI } from "../tasks/tasksAPI";
import { fetchUsersAPI } from "../users/usersAPI";

const PRIORITY_LABELS = { high: "Haute", medium: "Moyenne", low: "Faible" };
const STATUS_LABELS = {
  todo: "À faire",
  "in-progress": "En cours",
  done: "Terminé",
};

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTaskByIdAPI(id), fetchUsersAPI()])
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
    if (!task?.userId) return null;
    const user = users.find((u) => String(u.id) === String(task.userId));
    return user || null;
  };

  const getAvatarForUser = (user) => {
    if (!user)
      return `https://ui-avatars.com/api/?name=Non+attribu%C3%A9&background=6c9eff&color=fff&size=128`;
    return (
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=EEEEEE&color=555&size=64`
    );
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Confirmez-vous la suppression de cette tâche ? Cette action est irréversible.",
      )
    )
      return;
    await deleteTaskAPI(task.id);
    navigate("/");
  };

  if (loading) return <p>Chargement en cours...</p>;
  if (!task) return <p>Tâche introuvable</p>;

  const assignedUser = getAssignedUser();

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h4>{task.title}</h4>
              <p className="mb-1">
                <strong>Description:</strong> {task.description || "-"}
              </p>
              <p className="mb-1">
                <strong>Priorité:</strong>{" "}
                {PRIORITY_LABELS[task.priority] || task.priority}
              </p>
              <p className="mb-1">
                <strong>Statut:</strong>{" "}
                {STATUS_LABELS[task.status] || task.status}
              </p>
            </div>

            <div className="text-end">
              <img
                src={getAvatarForUser(assignedUser)}
                alt="avatar"
                className="avatar mb-2"
              />
              <div>{assignedUser ? assignedUser.username : "Non attribué"}</div>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/task/${task.id}/edit`)}
            >
              Modifier la tâche
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer la tâche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
