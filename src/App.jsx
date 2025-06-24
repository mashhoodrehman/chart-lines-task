import React from "react";
import HiringInsights from "./components/HiringInsights";

const generateMockData = (days) => {
  return {
    labels: Array.from({ length: days }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    ),
    datasets: {
      applicationToInterviewRate: Array.from({ length: days }, (_, i) =>
        Math.floor(40 + 30 * Math.sin(i / 4))
      ),
      offerAcceptanceRate: Array.from({ length: days }, (_, i) =>
        Math.floor(50 + 25 * Math.cos(i / 5))
      ),
      rejectionRate: Array.from({ length: days }, (_, i) =>
        Math.floor(60 + 30 * Math.sin(i / 6 + 2))
      ),
    },
  };
};

const App = () => {
  const insightsData = generateMockData(30);

  return (
    <>
      <HiringInsights initialData={insightsData} />
    </>
  );
};

export default App;
