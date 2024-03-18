const getCart = async (username) => {
    try {
        const response = await fetch(`http://localhost:8080/cart/${username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

const addToCart = async (username, eventId, quantity) => {
    try {
        const response = await fetch(`http://localhost:8080/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                eventId: eventId,
                quantity: quantity,
            }),
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

export { getCart, addToCart };
