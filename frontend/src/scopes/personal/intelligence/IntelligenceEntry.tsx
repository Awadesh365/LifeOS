import { Link } from "react-router-dom";
import { Button } from "@mui/material";
export default function IntelligenceEntry() {
  return (
    <section className="intel-panel" aria-label="WholeSignal Intelligence">
      <div className="intel-eyebrow">WholeSignal Intelligence</div>
      <h3 style={{ marginTop: 8 }}>Explore what comes next</h3>
      <p>
        Compare scenarios, inspect forecast readiness, and choose the data
        domains you want to use.
      </p>
      <Button component={Link} to="/app/intelligence">
        Open Intelligence
      </Button>
    </section>
  );
}
