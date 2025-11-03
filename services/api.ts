import axios from "axios"

export const api = axios.create({
  baseURL: "https://estoque-app-back-1.onrender.com", 
})
