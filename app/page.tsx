import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Professional Authentication, Simplified.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            seamless Next.js & Auth.js integration, and a smooth user experience,
            Eci Auth Implementation makes security your competitive advantage
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Link href={"/signin"}> Login / Signup </Link>
            </button>
            <button className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent/10 transition-colors">
              <Link href={"/dashboard"}> Secondary Action </Link>
            </button>
            <button className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent/10 transition-colors">
              <Link href={"/signup"}> Sign Up Action </Link>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
