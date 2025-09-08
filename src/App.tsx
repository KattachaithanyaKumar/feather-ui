import { useState } from "react";
import Button from "./components/Button";

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-2 p-10">
      <Button variant="default">Login</Button>
      <Button
        variant="primary"
        loading={loading}
        onClick={() => setLoading(true)}
      >
        Login
      </Button>
    </div>
  );
};

export default App;
