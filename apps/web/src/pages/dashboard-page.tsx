import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <div>
      <Link to="/users">Go to Users</Link>
      <Button>Click Me</Button>
    </div>
  );
}

export default DashboardPage;
