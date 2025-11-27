"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import FeatureCard from "@/components/FeatureCard";
import "./landing.css";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.getProfile();
      if (result.user) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      // User not authenticated, stay on landing page
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="navContent">
          <Link href="/" className="navBrand" aria-label="CodeDex Home">
            <img src="/images/codedex.png" alt="CodeDex" className="navLogo" />
          </Link>
          <div className="navLinks">
            {isAuthenticated ? (
              <Link href="/dashboard" className="navLink navPrimary">Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login" className="navLink">Login</Link>
                <Link href="/auth/signup" className="navLink navPrimary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="heroContent">
          <div><img src="/images/pokeball.png" alt="Pokéball" className="pokeball" /></div>
          <div><img src="/images/codedex.png" alt="CodeDex" className="heroTitle" /></div>
          <p className="heroTagline">Gotta Solve 'Em All!</p>
          <p className="heroDescription">
            Track your coding progress across multiple platforms with a Pokédex-inspired interface.
            Catch problems, level up your skills, and become the ultimate coding trainer.
          </p>
          <div className="heroCTA">
            {isAuthenticated ? (
              <Link href="/dashboard" className="ctaButton primary">
                Open Pokédex
              </Link>
            ) : (
              <>
                <Link href="/auth/signup" className="ctaButton primary">
                  Start Your Journey
                </Link>
                <Link href="/auth/login" className="ctaButton secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="sectionTitle">Features</h2>
        <div className="featureGrid">
          <FeatureCard
            icon="/images/progress-tracker.png"
            alt="Track Progress"
            title="Track Progress"
            desc="Monitor your problem-solving journey with detailed stats and visual progress tracking."
          />
          <FeatureCard
            icon="/images/multiple-platform.png"
            alt="Multiple Platforms"
            title="Multiple Platforms"
            desc="Connect LeetCode and Codeforces accounts to track all your problems in one place."
          />
          <FeatureCard
            icon="/images/catch-calendder.png"
            alt="Catch Calendar"
            title="Catch Calendar"
            desc="Visualize your daily coding activity with a heat map showing your catch streak."
          />
          <FeatureCard
            icon="/images/gym-battles.png"
            alt="Gym Battles"
            title="Gym Battles"
            desc="Stay updated with upcoming contests from all your connected platforms."
          />
        </div>
      </section>

      <section className="howItWorks">
        <h2 className="sectionTitle">How It Works</h2>
        <div className="timeline">
          <div className="timelineItem">
            <div className="timelineMarker">1</div>
            <div className="timelineCard">
              <h3 className="stepTitle">Create Account</h3>
              <p className="stepDesc">Sign up and start your coding trainer journey.</p>
            </div>
          </div>
          <div className="timelineItem">
            <div className="timelineMarker">2</div>
            <div className="timelineCard">
              <h3 className="stepTitle">Connect Platforms</h3>
              <p className="stepDesc">Link your LeetCode and Codeforces accounts.</p>
            </div>
          </div>
          <div className="timelineItem">
            <div className="timelineMarker">3</div>
            <div className="timelineCard">
              <h3 className="stepTitle">Catch 'Em All</h3>
              <p className="stepDesc">Solve problems and watch your Pokédex grow!</p>
            </div>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <FeatureCard
          className="finalCTA"
          title="Ready to Start Your Adventure?"
          desc="Join CodeDex and track your coding journey today!"
        >
          <Link href="/auth/signup" className="ctaButton primary large">
            Get Started
          </Link>
        </FeatureCard>
      )}

      <footer className="footer">
        <p>&copy; 2025 CodeDex. All rights reserved.</p>
      </footer>
    </div>
  );
}
