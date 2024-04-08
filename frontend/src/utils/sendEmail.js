import emailjs from "@emailjs/browser";
export default function SendEmail(e, user, event, purpose) {
    e.preventDefault();
    const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    let messageSubject;
    let messageBody;
    let messageFooter;

    switch (purpose) {
        case "booking":
            messageSubject = `Booking Confirmation for ${event.name}`;
            messageBody = `We've received your order for ${event.name} 🤩`;
            messageFooter = "We look forward to seeing you soon! ";
            break;
        case "eticket":
            messageSubject = `eTicket for ${event.name}`;
            messageBody = `Your eTicket for ${event.name} is confirmed 🤩`;
            messageFooter = "We look forward to seeing you soon! 🤩";
            break;
        case "cancellation":
            messageSubject = `Event cancellation for ${event.name}`;
            messageBody =
                "The event has been cancelled due to unforeseen circumstances 😔";
            messageFooter = "We hope to see you some other time!";
            break;
    }

    let email = user.username;
    if (email == "c") {
        email = "darylchua@hotmail.sg";
    }

    const template_params = {
        toName: email.split("@")[0],
        toEmail: email,
        //toEmail: user.username,
        messageSubject: messageSubject,
        messageBody: messageBody,
        eventName: event.name,
        eventVenue: event.venue,
        eventDateTime: event.datetime,
        ticketPrice: event.ticketPrice,
        ticketsBought: event.quantity,
        totalAmount: event.ticketPrice * event.quantity,
    };
    // emailjs.send(service_id, template_id, template_params).then(
    //     (response) => {
    //         console.log("SUCCESS", response);
    //     },
    //     (error) => {
    //         console.error("FAILED", error);
    //     }
    // );
}
