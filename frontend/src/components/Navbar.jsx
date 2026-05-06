import { useNavigate } from "react-router";

export default function Navbar() {
  //  const navigate = useNavigate();
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        backgroundColor: "#0b1220", // deep dark
        borderBottom: "1px solid rgba(65,105,225,0.2)",
        fontFamily: "sans-serif",
      }}
    >
      {/* BRAND */}
      <div
        style={{
          color: "#4169e1", // royal blue
          fontWeight: "700",
          fontSize: "1rem",
          letterSpacing: "0.5px",
          // cursor:"pointer"
        }}
//  onClick={() => navigate("/")}      
 >
        ResumeAI
      </div>

      {/* LINKS */}
      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
        }}
      >
        {["Dashboard", "Reports", "Insights"].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "0.9rem",
              padding: "6px 10px",
              borderRadius: "8px",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(65,105,225,0.15)";
              e.currentTarget.style.color = "#4169e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#cbd5e1";
            }}
          >
            {item}
          </a>
        ))}
      </div>

      

      {/* LOGOUT BUTTON */}
      <button
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(65,105,225,0.3)",
          transition: "0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        Logout
      </button>
    </nav>
  );
}