import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="logo-reactor" style={{ width: 28, height: 28 }} />
      <p className="not-found-code">ERROR 404 // SIGNAL LOST</p>
      <h1 className="heading-gradient">This sector is off the map.</h1>
      <p className="not-found-text">The page you were looking for doesn’t exist or has moved.</p>
      <Link href="/" className="btn btn-primary">Return to Base</Link>
    </main>
  );
}
