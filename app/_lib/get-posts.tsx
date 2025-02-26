import { Filters } from "types/filters";

export const getPosts = async (filters: Filters | null = null) => {
  try {
    console.log("test frontend url", process.env.frontendUrl);

    let res;
    if (filters == null) {
      res = await fetch(`${process.env.frontendUrl}/api/articles`, {
        method: "POST",
      });
    } else {
      let keywordsIn = "";
      if (filters.keywordsIn) {
        const keywordsInArray = filters.keywordsIn.split(",");
        for (let i = 0; i < keywordsInArray.length; i++) {
          let result = keywordsInArray[i].trim();
          keywordsIn += `${result},`;
        }
      }

      let keywordsEx = "";
      if (filters.keywordsEx) {
        const keywordsExArray = filters.keywordsEx.split(",");
        for (let i = 0; i < keywordsExArray.length; i++) {
          let result = keywordsExArray[i].trim();
          keywordsEx += `!${result},`;
        }
      }

      let q = keywordsIn + keywordsEx;
      q = q.replace(/^,+|,+$/g, "");

      res = await fetch(`${process.env.frontendUrl}/api/articles/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: q,
          topic: filters.topic,
          page: filters.page,
          limit: filters.limit,
          start: filters.start,
          end: filters.end,
        }),
        // next: {
        //   revalidate: 0,
        // },
        // cache: "no-store",
      });
      // request = new Request(`${process.env.frontendUrl}/api/articles/search`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: {
      //     q: q,
      //     topic: filters.topic,
      //     page: filters.page,
      //     limit: filters.limit,
      //     start: filters.start,
      //     end: filters.end,
      //   }),
      //   // next: {
      //   //   revalidate: 0,
      //   // },
      //   // cache: "no-store",
      // });
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    // console.log("Raw article data:", {
    //   authorList: data.articles[0].authorList,  // or however authors are stored in the raw data
    //   processedAuthors: data.articles[0].authors // the array that gets passed to PostItem
    // });
    return data;

    // let res;
    // if (searchTerm === "") {
    //   res = await fetch("http://localhost:3000/api/posts", {
    //     method: "POST",
    //   });
    // } else {
    //   res = await fetch(`http://localhost:3000/api/posts/search/?${searchTerm}`, {
    //     method: "POST",
    //     // body: JSON.stringify({
    //     //   q: searchTerm,
    //     // }),
    //   });
    // }

    // if (!res.ok) {
    //   throw new Error(`HTTP error! status: ${res.status}`);
    // }

    // const data = await res.json();

    // return data.articles; // Ensure this matches the response structure
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
