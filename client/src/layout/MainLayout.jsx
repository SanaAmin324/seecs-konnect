import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/MainLayout.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content-container">
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
