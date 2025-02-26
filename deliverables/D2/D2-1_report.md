## Summary of Decisions:

We chose React because its component-based architecture and efficient virtual DOM made it perfect for creating reusable components and a responsive user interface. Tailwind CSS was our choice for styling due to its utility-first approach, which allowed us to apply predefined classes directly in our JSX. This made our styling process more consistent across the application. We followed the Figma design created for D1 to ensure the UI matched the design specifications. For instance, the subteam created a Post component for displaying the articles. These Post components were then aggregated into a PostsList component, which was used on the HomePage, making maintenance and scalability easier.

On the backend, we used Node.js with Express.js because its non-blocking, event-driven architecture is well-suited for handling multiple requests efficiently we also used FETCH Api to align our fetching with the front end. We used Prisma for Object-Relational Mapping (ORM) to interact with our PostgreSQL database. Prisma's type-safe queries and schema-driven development enhanced our productivity and reduced the likelihood of runtime errors, and creates a visual representation for the seeded data. The Prisma schema defined in schema.prisma includes models for Article, Topic, ArticleTopic, and SubTopic, which facilitated seamless database interactions and ensured data integrity, this is communicated with and aligned across all projects.

We selected PostgreSQL for its scalability and support for advanced data types and indexing. Its ACID compliance ensured reliable transactions and data consistency. To populate the database with dummy data, we implemented a seeding script (seed.ts) that allowed us to test our application with realistic data during development, an we believed this way, our code will maintain integrity even for larger databases to come in future deliverables. The API endpoint in route.ts fetches articles by topic using Prisma to query the database, leveraging Prisma's powerful querying capabilities to efficiently retrieve the necessary data.

Our decisions were guided by the need for a scalable, maintainable, and efficient application. React and Tailwind CSS provided a good frontend solution, while Node.js with Express.js and Prisma ensured a reliable and performant backend. PostgreSQL was chosen for its advanced features and reliability, making it an ideal choice for our database needs.

## Individual Contributions:

Sean was responsible for creating the components shared by all the team members including the D2-1 subteam so that each subteam can maintain the same overall design for each functionality. This includes library components, styles file, and other utility components that are commonly used. He made each component such that it can be used in multiple different usecases. Sean also developed the majority of the page, including the postlist visible to the user. He also did the frontend filtering after Mark sent the data from the backend.

Mark was the backend developer for the our subteam. Mark set up a postgresql database, and linked it with Prisma ORM. Mark used an API request to pull data from the biorxiv database, and created a dummy_database in the repository. Then he populated the Postgresql table with the json data. In the process Mark created a prisma.schema file, where he considered the different data types we had to implement and made a seeding script accordingly. Here, Mark also created a new data model called mirrorArticle which was a new data model that fitted with the desired model from the front end. Next he created a route.ts file which basically takes the URL request, and upon the request return 50 most recent articles, with these articles, he made a script that goes with a drop down menu to parse through the articles on the page.

Jihyuk worked on the remainder frontend parts that were not developed. Jihyuk developed the footer of the page to include the logo and the copy right information. He also fixed the post item so that the publisher image can be correctly displayed next to each article. Also, as the product manager, Jihyuk reached out to the team mates and see if they require help or ask for help when the other needed it. He also tried to help out whenever possible on different parts. He also wrote out majority of the README file and the project report for the subteam.

## Details and Instructions

Our github repo and our video are evidence for our work. It can also be locally run following the instructions in the README file.

The video goes through the backend database and its inner workings, and concludes with the frontend interface that displays the backend logic in a visually pleasing manner.

## Our Application

Video Link:

https://drive.google.com/file/d/1qWjOmYTTGm7cwWGBNuMslsOCOkvF8FmA/view

Github repo:

https://github.com/csc301-2024-f/project-17-computational-bio-lab-ccbr/tree/D2-1
