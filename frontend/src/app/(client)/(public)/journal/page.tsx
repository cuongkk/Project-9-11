"use client";

import { useEffect, useState } from "react";
import { JournalArticleGrid } from "@/components/features/journal/JournalArticleGrid";
import { JournalHero } from "@/components/features/journal/JournalHero";
import { JournalSidebar } from "@/components/features/journal/JournalSidebar";
import type { ApiResponse, DashboardJournalsData, PublicJournal } from "@/types/client-api";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

export default function JournalPage() {
  const [articles, setArticles] = useState<PublicJournal[]>([]);
  const [trendingList, setTrendingList] = useState<PublicJournal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournals = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/journals`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Khong tai duoc du lieu journal.");
        }

        const payload = (await response.json()) as ApiResponse<DashboardJournalsData>;
        setArticles(payload.data?.articleList || []);
        setTrendingList(payload.data?.trendingList || []);
      } catch (fetchError) {
        console.error(fetchError);
        setReloadToast("error", "Khong tai duoc du lieu journal.");
        showReloadToastIfAny();
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, []);

  return (
    <main className="pt-20">
      <JournalHero />

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <JournalArticleGrid articles={articles} loading={loading} error={null} />
          <JournalSidebar trendingList={trendingList} />
        </div>
      </section>
    </main>
  );
}
