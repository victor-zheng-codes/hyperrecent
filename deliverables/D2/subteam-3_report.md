## CSC318 D2 Subteam 3

Video link: https://www.youtube.com/watch?v=96OB35fblLQ&ab_channel=VictorZheng

In the video above, we show the design of the appilcation for our sub group (topical searching). 
 
We show it at `localhost:3000` configured to run and report results. 

Dynamic routing is used to ensure that any topic id is avialble to be seardched.

----

## Environment Variable Setup

The following should be set up in the .env file

```bash


# the postgres database location
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/mydb"

# the url of the application
URL_KEY="http://localhost:3000"


```

## Getting Started

```
1. configure postgressql on the local pc
2. modify the environment variables with the above values
3. npm run dev
```

If there are prompts to install prisma. Ensure that you install it by checking https://www.prisma.io/docs/getting-started instructions.


### Documentation

Matthew was responsible for creating several essential frontend components, including the topic button, the topic buttons list, and the "Your Interested Topics" section. They implemented event handlers for the topic buttons, enabling the frontend to query the database for relevant posts based on the selected topic. These event handlers also redirected the user to a different page, where the home page would dynamically re-render the post list by using the route parameter to determine the selected topic.
Additionally, they ensured that the topic buttons list queried the database to retrieve and display all available topics. Throughout the development process, they defined interfaces and types for all components to maintain type safety and consistency across the codebase.


In addition to functionality, Matthew ensured that all components were carefully styled to match the mockup created during the design phase (D1). This included aligning the topic buttons, lists, and the "Your Interested Topics" section with the visual specifications, such as colour schemes, spacing, and typography. They worked to maintain consistency in the design, ensuring that the components reflected the intended look and feel of the mockup while providing a polished user experience.




Initially, Matthew considered using state hooks to update and pass down state values, but ultimately decided that rerouting to a different page was a more efficient solution. This approach proved to be more compatible with the existing components and architecture already established by the frontend team lead, allowing for better integration within the overall project. The PostList, Post, and HomePage components were originally written by the frontend team lead, Sean and were reused in this deliverable. 

## Unit Tests

Victor was responsible for several critical backend tasks and unit testing to ensure the robustness of both the frontend and backend components. He developed the database model, which included designing the relationships between key entities such as Articles, Authors, Topics, and Subtopics. This involved creating and configuring schema relationships to accurately represent how these entities interact. He also seeded the database with appropriate data to facilitate development and testing.

## API development 

In terms of API development, he created multiple endpoints to enable seamless data retrieval from the database. These included /api/posts, which fetches all available posts, /api/topics, which retrieves all the topics, /api/authors for fetching all author data, and /api/topics/[id], which returns all articles associated with a specific topic ID.
Additionally, they ensured that the API responses were properly formatted in JSON to match the requirements of the frontend, allowing for smooth integration and data presentation. Their work on both unit tests and API formatting was crucial in maintaining consistent data flow between the backend and frontend, ensuring that the system worked as expected throughout.

## SQLLite 

SQLite was initially considered for mocking the database; however, after reviewing documentation, it was determined that PostgreSQL would offer more extensive support, particularly with Prisma, which provided comprehensive guidance for PostgreSQL usage. Additionally, Victor considered using a single Authors table but concluded that it was not ideal, as it would not allow for linking multiple authors to a single article. To address this, a relationship between institutions and articles was also established, enabling the future implementation of an article-to-institution mapping.

## Tech Stack 

The tech stack was carefully discussed and decided upon in collaboration with both frontend and backend teams. We chose to use Next.js, PostgreSQL, TailwindCSS, and Node.js for the project. Initially, we considered separating the frontend and backend into distinct folders; however, we ultimately opted for a monorepo to simplify project management. Additionally, all files were moved to the root directory to facilitate Heroku’s automatic deployment process and to accommodate future attempts to integrate Docker.


![file](img/d2-subteam3.png?raw=true "Title")
