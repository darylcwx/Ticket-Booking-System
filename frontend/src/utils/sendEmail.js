import emailjs from "@emailjs/browser";
export default function SendEmail(e, toEmail, event) {
    e.preventDefault();
    const service_id = import.meta.env.VITE_EMAILJS_D_SERVICE_ID;
    const template_id = import.meta.env.VITE_EMAILJS_D_TEMPLATE_ID;

    const template_params = {
        toEmail: toEmail,
        eventName: event.name,
        eventDateTime: event.datetime,
        ticketPrice: event.ticketPrice,
        ticketsBought: event.quantity,
        totalAmount: event.ticketPrice * event.quantity,
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
