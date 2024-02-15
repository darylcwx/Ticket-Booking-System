import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const res = async () => {
      const result = await fetch("http://localhost:8080/hello");
      console.log(result);
      if (result.ok) {
        const data = await result.json();
        console.log(data);
      }
    };
    res();
  }, []);

  const handleSendEmail = async () => {
    try {
      const toEmail = "daryl.chua.2021@scis.smu.edu.sg";
      const toName = "Daryl";
      const ticketId = 123;
      const message = "Successfully booked. here are details.";
      const data = {
        service_id: import.meta.env.VITE_EMAILJS_D_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_D_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_D_PUBLIC_KEY,
        template_params: {
          toEmail: toEmail,
          toName: toName,
          ticketId: ticketId,
          message: message,
        },
      };
      const url = "https://api.emailjs.com/api/v1.0/email/send";
      const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await fetch(url, options);
      console.log(result);
      if (result.ok) {
        console.log("email sent");
      }
    } catch (e) {
      console.error(JSON.stringify(e));
      console.log("Something went wrong.");
    }
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="text-[64px]">hello test</div>
      <button className="" onClick={handleSendEmail}>
        Send Email Button
      </button>
    </>
  );
}

export default App;
