class ApiService {
  get(path) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}${path}`, {
          mode: "cors",
          method: "GET",
        });
        const res = await response.json();
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }
}
const API = new ApiService();
export default API;
