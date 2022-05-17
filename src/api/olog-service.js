import axios from "axios";

const ologServiceBaseUrl = process.env.REACT_APP_BASE_URL; // e.g. http://localhost:8080/Olog

// Need axios for back-end access as the "fetch" API does not support CORS cookies.
export default axios.create({
    baseURL: ologServiceBaseUrl
});