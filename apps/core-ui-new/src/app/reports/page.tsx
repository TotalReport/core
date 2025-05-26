import { ReportsPageContainer } from "@/containers/reports/teports-page-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports - Total Report",
};

export default function ReportsPage() {
  return <ReportsPageContainer />;
}
