import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";
import io from "socket.io-client";

function App() {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create a single socket connection
    socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.io");
    });

    socketRef.current.on("new_user_login", (data) => {
      toast.info(data.message);
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const runEvent = () => {
    if (socketRef.current) {
      socketRef.current.emit("new_user_login", { message: "User has Logged In" });
    }
  };

  const runLocalEvent = () => {
    toast.info("This is a local event");
  };

  return (
    <div className="App">
      {/* <ToastContainer position="top-center" /> */}
      <button onClick={runEvent}>Click for real-time events</button>
      <button onClick={runLocalEvent}>Click for local events</button>
    </div>
  );
}

export default App;
