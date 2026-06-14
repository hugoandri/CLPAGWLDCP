"use client";

import { useMemo, useState } from "react";
import { getLatestArticles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";

const allArticles = getLatestArticles();

export default function TendenciasClient() {
  const [category, setCategory] = useState("all");

  const options: FilterOption[] = useMemo(() => {
    const cats = Array.from(new Set(allArticles.map((a) => a.category)));
    return [
      { value: "all", label: "Todo" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, []);

  const filtered =
    category === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === category);

  return (
    <div className="space-y-5">
      <FilterTabs
        options={options}
        value={category}
        onChange={setCategory}
        aria-label="Filtrar por categoría"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a, i) => {
          const card = <ArticleCard key={a.slug} article={a} />;
          if (i === 4) {
            return (
              <div key="ad-wrap" className="contents">
                {card}
                <AdSlot
                  slotName="tendencias-infeed"
                  format="in-feed"
                  className="sm:col-span-2 lg:col-span-3"
                />
              </div>
            );
          }
          return card;
        })}
      </div>
    </div>
  );
}
