"use client";
import DashboardLayout from "@/components/DashboardLayout";
import "../dashboard.css";

export default function ContestsPage() {
  return (
    <DashboardLayout>
      <header className="dashboardHeader">
          <h1 className="dashboardTitle">Gym Battles</h1>
          <p className="dashboardSubtitle">Upcoming coding contests across platforms</p>
        </header>

        <section className="contestsSection">
          <div className="contestsCard">
            <p className="emptyState">
              No upcoming contests at the moment. Check back later for new gym battles!
            </p>
          </div>
        </section>
    </DashboardLayout>
  );
}
