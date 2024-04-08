import emailjs from "@emailjs/browser";

const options = {
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    blockHeadless: true,
    limitRate: {
        id: "app",
        throttle: 10000,
    },
};
emailjs.init(options);

export default emailjs;
