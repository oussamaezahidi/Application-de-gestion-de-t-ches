import React from "react";

const PRIORITY_LABELS = { high: "Haute", medium: "Moyenne", low: "Faible" };

const Column = ({ title, status, tasks, onDrop, onDetails }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropEvent = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onDrop(parseInt(taskId, 10), status);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDropEvent}>
      <h3>{title}</h3>
      {tasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
        >
          <div>{task.title}</div>
          <div>
            Priorité : {PRIORITY_LABELS[task.priority] || task.priority}
          </div>
          <div>
            Assigné à :{" "}
            {task.userId ? `Utilisateur ${task.userId}` : "Non attribué"}
          </div>
          <button onClick={() => onDetails(task.id)}>Voir les détails</button>
        </div>
      ))}
    </div>
  );
};

export default Column;
