import TaskCard from "./TaskCard";

function Column({ title, tasks, onDrop }) {
    const handleDrop = (e) => {
        const taskId = e.dataTransfer.getData("taskId");
        onDrop(Number(taskId));
    };

    return (
        <div
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <h2>{title}</h2>
            {tasks.map((task) => (
                <div
                    key={task.id}
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData("taskId", task.id)
                    }
                >
                    <TaskCard task={task} />
                </div>
            ))}
        </div>
    );
}

export default Column;