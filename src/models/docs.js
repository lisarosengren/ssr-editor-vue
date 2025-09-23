const baseURL = import.meta.env.VITE_API_URL;



export async function getAll() {
        const response = await fetch(baseURL);
        const result = await response.json();

        return result
    }

const docs = { getAll }
export default docs;