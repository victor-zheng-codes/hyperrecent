"use client";

import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";

import { useEffect, useState } from "react";
import { Filters } from "types/filters";
import { PostType } from "types/posts";

import { getPosts } from "../_lib/get-posts";
import { ApplyButton } from "./apply-button";
import { DateRangePicker } from "./date-range-picker";
import { Container } from "./layout/container";
import { LoadingSpinner } from "./loading-spinner";
import { PostsList } from "./posts-list";
import { SearchBar } from "./search-bar";
import { SearchBarExclude } from "./search-bar-exclude";
import { TopicButtons } from "./topic-buttons";
import { capitalizeFirstLetter } from "@/utils/strings";
import { Topic, getTopics } from "app/_lib/topics";
import { PageSelection } from "./page-selection";
import { PaginationData } from "types/pagination-data";

export const PostsController = ({
  posts,
  showTopics = true,
  forcedTopic,
  searchFilters,
  paginationData,
}: {
  posts: PostType[];
  showTopics?: boolean;
  forcedTopic?: {
    label: string;
    value: number;
  };
  searchFilters: Filters;
  paginationData: PaginationData
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState<PostType[]>(posts);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [topicsFetched, setTopicsFetched] = useState(false);
  const [filters, setFilters] = useState(searchFilters);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingNewPosts, setLoadingNewPosts] = useState(false);
  const [pageData, setPageData] = useState(paginationData)

  const filtersJSON = JSON.stringify(filters);
  useEffect(() => {
    if (!topicsFetched) {
      const fetchTopics = async () => {
        try {
          const fetchedTopics = await getTopics();
          setTopics(fetchedTopics);
        } catch (error) {
          console.error("Failed to fetch topics:", error);
        }
      };
      setTopicsFetched(true);
      fetchTopics();
    }
    const topicsCleaned = filters.topic.filter((topic) => Number.isInteger(topic));
    setFilters({
      ...filters,
      topic: topicsCleaned
    })
    document.cookie = `topicPreference=${filtersJSON}; path=/; max-age=31536000;`;
  }, []);

  const getTopicLabel = (topicID: number) => {
    const topic = topics.filter((topic) => topic.value == topicID)
    const topicLabel = topic.length != 0 ? topic[0].label : "";
    return topicLabel;
  }

  const handleApplyFilters = async (filters: Filters) => {
    let filtersJSON = JSON.stringify(filters);
    document.cookie = `topicPreference=${filtersJSON}; path=/; max-age=31536000;`;
    if (filters.topic.length == 1 && window.location.pathname == "/articles") return; // if single topic selected we will reroute to a new page, so we don't want to fetch posts twice

    setLoadingNewPosts(true);

    const formatDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    };

    if (!startDate || !endDate) {
    } else {
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
      setFilters({ ...filters, start: startStr, end: endStr });
    }

    const res = await getPosts(filters) || [];
    const data = res.articles;
    const pageData = res.pagination;
    setPageData(pageData);
    setData(data);
   
    setLoadingNewPosts(false);
    filtersJSON = JSON.stringify(filters);
    document.cookie = `topicPreference=${filtersJSON}; path=/; max-age=31536000;`;
  };

  return (
    <Container>
      <div className="grid min-h-[80vh] grid-cols-1 md:grid-cols-3">
        <div className="order-2 col-span-2 mt-12 md:order-1 md:border-r md:border-r-black/10 md:pr-10">
          <h1 className="mb-10 text-3xl font-bold tracking-tighter">
            {capitalizeFirstLetter(forcedTopic?.label.concat(" Articles") || "All Results")}
          </h1>

          {!loadingNewPosts && <PostsList posts={data} />}

          {loadingNewPosts && (
            <div className="flex justify-center">
              <LoadingSpinner height={20} />
            </div>
          )}
          <PageSelection filters={filters} pageData={pageData} setFilters={setFilters} applyFilters={handleApplyFilters}></PageSelection>
        </div>

        <div className="order-1 col-span-1 mt-8 border-b border-black/25 pb-6 md:order-2 md:mt-12 md:border-0 md:pb-0 md:pl-10">
          <button
            className="mb-5 block border border-black/50 p-3 leading-none md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <div className={clsx("hidden md:block", showFilters && "!block")}>
            {showTopics && (
              <div className="border-b-tan-300 mb-10 border-b pb-10">
                <h2 className="mb-5 text-xl font-bold tracking-tighter">
                  Browse by Topic
                </h2>
                <TopicButtons filters={filters} onClick={setFilters} />
              </div>
            )}

            <h1 className="mb-5 text-xl font-bold tracking-tighter">
              Refine Your Search
            </h1>

            <div className="mb-5">
              <SearchBar filters={filters} onChange={setFilters} />
            </div>

            <div className="mb-5">
              <SearchBarExclude filters={filters} onChange={setFilters} />
            </div>

            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              filters={filters}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onFilter={setFilters}
            />

            <div className="mt-8 md:mt-16">
              <ApplyButton 
                onClick={handleApplyFilters} 
                filters={filters}
                topicLabel={getTopicLabel(filters.topic[0])} 
                singleTopicSelected={filters.topic.length == 1}/>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
