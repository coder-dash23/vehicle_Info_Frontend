import {React, useMemo} from "react";
import Cookies from "universal-cookie";

const Downloadcsv = () => {

  const cookies = useMemo(() => new Cookies(), []);

  const handleDownload = async () => {
    try {
      const token = cookies.get("token");
      const response = await fetch("http://localhost:8090/api/csv/download", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch CSV");
      }

      const blob = await response.blob(); // API already returns a Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = "vehicles.csv"; // Downloaded file name
      a.click();
      
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <button
    onClick={() => handleDownload()}
    className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer mb-6"
  >
    Download in CSV
  </button>
  );
};

export default Downloadcsv;
