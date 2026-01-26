export const selectAllTasks = (state) => state.tasks.items;

export const selectTaskById = (id) => (state) =>
    state.tasks.items.find((task) => task.id === id);

export const selectTasksByStatus = (status) => (state) =>
    state.tasks.items.filter((task) => task.status === status);

export const selectTasksByUser = (userId) => (state) =>
    state.tasks.items.filter((task) => task.userId === userId);