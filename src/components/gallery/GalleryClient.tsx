"use client";

import { useState } from "react";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <>
      {/* Filters + Gallery */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category filters */}
          <div className="mb-12">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Gallery grid */}
          <GalleryGrid activeCategory={activeCategory} />
        </div>
      </section>
    </>
  );
}
