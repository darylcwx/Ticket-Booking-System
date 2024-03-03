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
        console.log(data);
    } catch (e) {
        console.log(e);
    }
};
export { addToCart };
