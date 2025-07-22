import React from "react";
import LaunchesContainer from "@/containers/launches/launches-container.js";
import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";

export const title = "Launches - Total Report";

export default function Launches() {
  return (
    <RestAPIProvider>
      <LaunchesContainer />
    </RestAPIProvider>
  );
}
