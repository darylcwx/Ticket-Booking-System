function formatDatetime(datetimeString) {
    const datetime = new Date(datetimeString);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Singapore",
    };
    return datetime.toLocaleString("en-US", options);
}

export default formatDatetime;
