export default async function getUser(username) {
    try {
        const response = await fetch(`http://localhost:8080/user/${username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
        return null;
    }
}
