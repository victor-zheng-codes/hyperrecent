"use client";

import { Filters } from "types/filters";
import { useRouter } from "next/navigation";

export const TopicButton = ({
  active,
  topic,
  filters,
  onClick,
}: {
  active: boolean;
  topic: {
    value: number;
    label: string;
  };
  filters: Filters;
  onClick: (filters: Filters) => void;
}) => {
  
  return (
    <button
      // Dynamic styling based on active state
      className={`rounded-full font-medium ${active ? "bg-amber-200 text-amber-900" : "bg-stone-200"} p-1.5 px-3.5 text-sm tracking-tighter transition-colors hover:bg-amber-200`}
      onClick={() => {
        // Clone current topics array
        let new_topics = filters.topic.slice();
        // Toggle topic selection
        if (new_topics.includes(topic.value)) {
          new_topics = filters.topic.filter((value) => value != topic.value);
        }
        else {
          new_topics.push(topic.value)
        }
        
        // Update filters with new topic selection
        onClick({
          ...filters,
          topic: new_topics,
        });
      }}
    >
      {capitalized(topic.label)}
    </button>
  );
};

// Helper function to capitalize first letter
const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);
