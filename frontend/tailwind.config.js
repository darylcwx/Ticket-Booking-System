/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{jsx,js}"],
    theme: {
        extend: {
            colors: {
                main: "#1A1B1E",
                modal: "#f2f2f2",
                navbar: "#f2f2f2",
                ticketDivider: "#1A1B1E",
                hover: "#1565c0",
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
        },
    },
    plugins: [],
};
