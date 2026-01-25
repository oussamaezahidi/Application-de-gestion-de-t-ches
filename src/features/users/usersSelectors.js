export const selectAllUsers = (state) => state.users.items;
export const selectUserById = (id) => (state) =>
  state.users.items.find((user) => user.id === id);
