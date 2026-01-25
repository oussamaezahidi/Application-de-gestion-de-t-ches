import{axios} from "axios";
const db_json="  http://localhost:3001";
export const fetchUsersAPI=()=>axios.get(` ${db_json}/users`);
export const addUserAPI=(user)=>axios.post(`${db_json}/users`,user);
export const deleteUserAPI=(id)=>axios.delete(`${db_json}/users/${id}`);
