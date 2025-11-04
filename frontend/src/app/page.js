import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to CodeDex</h1>
      <Link href="/signup">Go to Signup</Link>
      <br />
      <Link href="/login">Go to Login</Link>
    </div>
  );
}
