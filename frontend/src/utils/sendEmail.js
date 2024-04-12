import emailjs from "@emailjs/browser";
import formatDatetime from "../utils/formatDatetime";
export default function SendEmail(
    e,
    user,
    purpose,
    event = null,
    tempPass = null
) {
    e.preventDefault();
    const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    let template_id;
    let messageSubject;
    let messageBody;
    let messageFooter;

    // email here for testing
    let toEmail = user.username;
    const toName = " " + toEmail.split("@")[0];

    switch (purpose) {
        case "booking":
            template_id = import.meta.env.VITE_EMAILJS_EVENT_TEMPLATE_ID;
            messageSubject = `Booking Confirmation for ${event.name}`;
            messageBody = `We've received your order for ${event.name} 🤩
                            You may login and go to your bookings to view more details.`;
            messageFooter = "We look forward to seeing you soon!";
            break;
        case "e-ticket":
            template_id = import.meta.env.VITE_EMAILJS_EVENT_TEMPLATE_ID;
            messageSubject = `eTicket for ${event.eventName}`;
            messageBody = `Your eTicket for ${event.eventName} is confirmed 🤩`;
            messageFooter = "We look forward to seeing you soon!";
            break;
        case "cancellation":
            template_id = import.meta.env.VITE_EMAILJS_EVENT_TEMPLATE_ID;
            messageSubject = `Event cancellation for ${event.name}`;
            messageBody =
                "The event has been cancelled due to unforeseen circumstances 😔";
            messageFooter = "We hope to see you some other time!";
            break;
        case "resetPassword":
            template_id = import.meta.env.VITE_EMAILJS_OTHER_TEMPLATE_ID;
            messageSubject = `Reset password for ${user.username}`;
            messageBody = `You may reset your password via this link: http://localhost:5173/forgot
                            Your new temporary password is: ${tempPass}`;
            messageFooter = `Happy event hunting! 🤩`;
            break;
    }

    const template_params = {
        toName: toName,
        toEmail: toEmail,
        messageSubject: messageSubject,
        messageBody: messageBody,
        messageFooter: messageFooter,
        eventName: event?.eventName,
        eventVenue: event?.venue,
        eventDateTime: formatDatetime(event?.datetime), // why isit giving datetime now
        ticketPrice: event?.price,
        ticketsBought: event?.quantity,
        totalAmount: event?.ticketPrice * event?.quantity,
        ticketId: event?.ticketId,
    };

    emailjs.send(service_id, template_id, template_params).then(
        (response) => {
            console.log("SUCCESS", response);
        },
        (error) => {
            console.error("FAILED", error);
        }
    );
}
