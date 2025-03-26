
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-oliveGreen-50 to-oliveGreen-100">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-oliveGreen-800 mb-4">404</h1>
        <p className="text-xl text-oliveGreen-700 mb-6">Oops! Page not found</p>
        <p className="text-oliveGreen-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-oliveGreen-600 hover:bg-oliveGreen-700">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
