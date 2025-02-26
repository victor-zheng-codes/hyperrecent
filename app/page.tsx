import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Import the redirect utility

import { Onboarding } from "./_components/onboarding";
import { getTopics } from "./_lib/topics";

export default async function HomePage() {
  const cookieStore = await cookies();
  const topics = await getTopics();
  const myCookie = cookieStore.get("topicPreference");

  // if (myCookie) {
  //   const topicId = parseInt(myCookie.value);
  //   const topicsLabelFrom = topics.find((t) => t.value === topicId)?.label;
  //   redirect("/articles/" + topicsLabelFrom);
  // }

  return <Onboarding />;
}
