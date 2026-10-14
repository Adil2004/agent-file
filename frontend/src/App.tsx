import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadForm from "./pages/UploadForm";
import DetailFile from "./pages/DetailFile";
import ChatFile from "./pages/ChatFile";

import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Navigate to="/login" replace />;
}

function RegisterAndLogout() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Register />;
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/upload-file" element={<UploadForm/>}/>
          <Route path="/files/:fileId" element={<DetailFile/>}/>
          <Route path = "/login" element={<Login />} />
          <Route path = "/logout" element={<Logout />} />
          <Route path = "/register" element={<RegisterAndLogout />} />
          <Route path = "/files/:fileId/chat" element={<ChatFile/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;