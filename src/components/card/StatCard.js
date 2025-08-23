// A simple card to display a statistic
export default function StatCard({ title, count, lastUpdated }) {
  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "8px",
        minWidth: "200px",
      }}
    >
      <h3 style={{ marginTop: 0, textTransform: "capitalize" }}>{title}</h3>
      <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "8px 0" }}>
        {count}
      </p>
      <p style={{ fontSize: "0.8rem", color: "#666", margin: 0 }}>
        Last updated: {formattedDate}
      </p>
    </div>
  );
}
