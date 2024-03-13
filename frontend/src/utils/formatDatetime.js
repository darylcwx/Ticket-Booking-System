const formatDatetime = (datetime) => {
    const date = new Date(datetime);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
};

export default formatDatetime;
