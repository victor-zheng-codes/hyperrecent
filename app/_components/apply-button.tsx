import { useRouter } from "next/navigation";
import { Filters } from "types/filters";

export const ApplyButton = ({
    onClick,
    filters,
    topicLabel,
    singleTopicSelected,
}: {
    onClick: (filters: Filters) => void;
    filters: Filters;
    topicLabel: string;
    singleTopicSelected: boolean;
}) => {
    const router = useRouter();
    return (
        <button
            className="w-full text-center rounded-full font-medium text-white p-1.5 px-3.5 tracking-tighter transition-colors bg-black"
            onClick={() => {
            // First execute the passed onClick handler (usually updates filters)
            onClick({
                ...filters,
                page: 1,
            });
            // If only one topic is selected, redirect to that topic's page
            if (singleTopicSelected) router.push(`/articles/${topicLabel}`);
            }}
        >
            Apply Filters
        </button>
    )
}