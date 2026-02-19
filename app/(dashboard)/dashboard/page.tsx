import type { Metadata } from "next";
import { DashboardContent } from "@/components/tasks/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard - TaskFlow",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
