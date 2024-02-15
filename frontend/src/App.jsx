import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import emailjs from "@emailjs/browser";
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

  const handleSendEmail = (e) => {
    e.preventDefault();
    const toEmail = "daryl.chua.2021@scis.smu.edu.sg";
    const toName = "Daryl";
    const ticketId = 123;
    const message = "Successfully booked. here are details.";
    const service_id = import.meta.env.VITE_EMAILJS_D_SERVICE_ID;
    const template_id = import.meta.env.VITE_EMAILJS_D_TEMPLATE_ID;
    const template_params = {
      toEmail: toEmail,
      toName: toName,
      ticketId: ticketId,
      message: message,
    };
    emailjs.send(service_id, template_id, template_params).then(
      (response) => {
        console.log("SUCCESS", response);
      },
      (error) => {
        console.error("FAILED", error);
      }
    );
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
