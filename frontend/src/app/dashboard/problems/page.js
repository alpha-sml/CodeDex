"use client";
import DashboardLayout from "@/components/DashboardLayout";
import "../dashboard.css";

export default function ProblemsPage() {
  return (
    <DashboardLayout>
      <header className="dashboardHeader">
          <h1 className="dashboardTitle">Your Pokédex</h1>
          <p className="dashboardSubtitle">All your caught problems in one place</p>
        </header>

        <section className="problemsSection">
          <div className="problemsCard">
            <p className="emptyState">
              No problems caught yet. Connect your platforms and start solving to fill your Pokédex!
            </p>
          </div>
        </section>
    </DashboardLayout>
  );
}
