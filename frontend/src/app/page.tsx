import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex-grow max-w-4xl mx-auto space-y-8 py-8">
        <Header 
          title="Velkommen til Gefylen Virtuelle Café"
        />

        {/* About Section */}
        <div className="rounded-2xl bg-white">
          <p className="text-gray-600 leading-relaxed mb-6">
            Ingen fysiske lokaler? Ingen hindring! Vi holder til i cyberspace, uten at det er noen festdemper!
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Nyt vår oppskrifter og quizzer fra din egen sofa!
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center space-x-4">
          <Link href="/menu">
            <Button className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg text-lg font-medium cursor-pointer">
              Meny
            </Button>
          </Link>
          <Link href="/quiz">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-medium cursor-pointer">
              Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
