import { getInvestigationData } from "@/lib/db";
import Link from "next/link";
import { transformInvestigationData } from "@/lib/reportAdapter";
import { PremiumReportView } from "@/components/PremiumReportView";

export const dynamic = 'force-dynamic';

export default async function FinalReportPage() {
  const data = await getInvestigationData();
  const { website, findings } = data;

  if (!website && findings.length === 0) {
    return (
      <main className="min-h-screen bg-[#F2F1EC] p-8 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#D9D6CB] text-center max-w-md">
          <h1 className="text-3xl font-serif text-[#1B1F27] mb-3">No Report Found</h1>
          <p className="text-[#726E62] mb-6">Please run a new prospect investigation first.</p>
          <Link 
            href="/" 
            className="inline-block bg-[#2C4460] text-white font-mono text-sm uppercase tracking-wider py-3 px-6 rounded hover:bg-[#1B1F27] transition"
          >
            ← Start New Investigation
          </Link>
        </div>
      </main>
    );
  }

  const premiumData = transformInvestigationData(data);

  return <PremiumReportView data={premiumData} />;
}


