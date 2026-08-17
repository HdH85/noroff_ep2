import LandingPage from "@/components/LandingPage";

export default async function Home() {
  return (
    <main>
      <div className="text-center grid grid-cols-6 gap-4">
        <LandingPage />
      </div>
    </main> 
  );
};
