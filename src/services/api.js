import axios from 'axios'

const BASE_URL = 'https://681507e7225ff1af162aeb7e.mockapi.io/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})



/**
 * Trae las tareas que tienen projectId.
 * @param {string|number} projectId
 */
export async function fetchTasks(projectId) {
  const { data } = await axios.get(`${BASE_URL}/tasks`, {
    params: { projectId }
  })
  return data
}
