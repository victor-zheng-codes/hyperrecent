"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Topic, getTopics } from "app/_lib/topics";

import { Container } from "./layout/container";
import { TopicButtons } from "./topic-buttons";

export const Onboarding = () => {
  const router = useRouter();
  // Initialize filters state with default values
  const [filters, setFilters] = useState({
    keywordsIn: "",
    keywordsEx: "",
    topic: new Array(),
    page: 1,
    limit: 20,
    start: "",
    end: "",
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopicLabel, setSelectedTopicLabel] = useState("");

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const fetchedTopics = await getTopics();
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Update selected topic label when topic changes
  useEffect(() => {
    if (filters.topic.length > 0 && topics.length > 0) {
      const selectedTopic = topics.find(
        (topic) => topic.value === filters.topic[0],
      );
      if (selectedTopic) {
        setSelectedTopicLabel(selectedTopic.label);
      }
    }
  }, [filters.topic, topics]);

  // Determine button text and href based on topic selection
  const buttonText =
    filters.topic.length > 0
      ? "Proceed with selection"
      : "Or view all articles";

  let href =
    filters.topic.length === 1
      ? `/articles/${selectedTopicLabel}`
      : "/articles";

  // Save topic preference in cookie before navigation
  const setPreferences = () => {
    const filtersJSON = JSON.stringify(filters);
    console.log(filtersJSON);
    document.cookie = `topicPreference=${filtersJSON}; path=/; max-age=31536000;`; // Expires in 1 year
  };

  return (
    <>
      <div className="py-20">
        <Container className="!max-w-[900px]">
          <div className="text-center text-4xl font-semibold tracking-tighter">
            What topic are you interested in?
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 rounded-2xl border border-black/20 p-4">
            <TopicButtons filters={filters} onClick={setFilters} />
          </div>

          <div className="mt-10 flex justify-end">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-stone-200 px-4 py-1.5 text-sm font-medium text-stone-900"
              href={href}
              onClick={setPreferences}
            >
              {buttonText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
};
