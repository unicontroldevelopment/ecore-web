import axios from "axios";

export const api = axios.create({
    baseURL: "https://ecoreweb-api-7886ab85c088.herokuapp.com/",
});
