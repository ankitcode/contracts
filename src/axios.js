import axios from "axios";

const API = axios.create({
    baseURL: "http://10.117.0.6:5000",
});

export default API;
