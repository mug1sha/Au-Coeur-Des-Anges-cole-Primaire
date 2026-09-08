"use client";

import { motion } from "framer-motion";

const categories = [
  { id: "all", label: "Toutes" },
  { id: "vie-scolaire", label: "Vie scolaire" },
  { id: "activites", label: "Activités" },
  { id: "sport", label: "Sport" },
  { id: "arts", label: "Arts & créativité" },
  { id: "evenements", label: "Événements" },
];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`relative px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2 ${
            activeCategory === category.id
              ? "bg-navy text-white shadow-md"
              : "bg-offwhite text-navy/60 hover:bg-lightgray/50 hover:text-navy"
          }`}
        >
          {activeCategory === category.id && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-navy rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{category.label}</span>
        </button>
      ))}
    </div>
  );
}
