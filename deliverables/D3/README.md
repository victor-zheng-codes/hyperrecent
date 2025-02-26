<!-- CSC301

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZzmLl-eM) -->

# Hyper-Recent

## Our Partner

We are working with are the Computational biology laboratory, Donnelly Centre for Cellular and Biomolecular Research. We are working with Professor, Principal Investigator Gary Bader (gary.bader@utoronto.ca) and Researcy Associate Jeffrey Wong (jvwong@gmail.com). The Donnelly Centre brings together scientists from diverse fields like systems biology, bioengineering, and computer science to advance genomic technology and computational biology for breakthroughs in science and medicine. With a research community of 550 members, the Centre addresses key challenges in basic science and human health while training future interdisciplinary researchers.

## The Project

Hyper-Recent is a website designed to collect and showcase the most recent and relevant scientific papers for researchers. Developed in collaboration with the Donnelly Centre for Cellular and Biomolecular Research, it addresses the need for a lightweight platform that highlights the latest papers, including pre-publication works. Given the delays in traditional publishing, where papers undergo lengthy review processes, existing resources like PubMed often lack the newest literature, and platforms like bioRxiv can be cluttered and difficult to navigate. The goal is to create a user-friendly site that provides access to the latest scientific research, even before official publication.

## Key Features

1. **Topic-Based Browsing**

   - **Description**: The main page presents users with a feed of a range of scientific topics to browse and choose from. Each topic serves as a gateway to a curated list of publications relevant to that specific field.
   - **Value**: This feature simplifies the exploration of content by allowing users to quickly navigate to their areas of interest without overwhelming them with irrelevant material, aligning with the demand of our partner, which was to create a lightweight product for biological publication.

2. **Recent Publications Display**

   - **Description**: Once a topic is selected, users are shown the most recent publications related to that field, with content sorted by publication date by default. The publications are updated hourly, with the most recent publication displayed at the top.
   - **Value**: Users stay up to date with the latest scientific findings, ensuring that they are always aware of new developments in their chosen fields, this aligns with our goal of making researches and publications more accessible for researchers and students.

3. **Keyword Filtering within Topics**

   - **Description**: Users can refine their searches by inputting specific keywords within a topic, narrowing down the displayed content to papers and articles containing the specified terms.
   - **Value**: This targeted search capability helps users quickly find publications that are most relevant to their specific research needs or interests, furthermore, this is a core feature requested by our partner, as there are no products currently available that allows search to narrow the scope.

4. **Exclusion of Keywords**

   - **Description**: Users have the option to exclude certain keywords while filtering content, effectively removing irrelevant publications that may contain those terms.
   - **Value**: This exclusion feature enhances search efficiency by allowing users to avoid content that may clutter results or be irrelevant to their specific focus.

5. **Date Range Filter**

   - **Description**: Users can filter publications based on a specific date range, enabling them to adjust the time frame for the content they want to explore.
   - **Value**: The date filter allows users to control the recency of the publications they view, whether they are interested in only the latest research or in finding papers from a specific period.

6. **Sorting by Popularity (Shares)**

   - **Description**: Users can sort articles by the number of shares within the scientific community, with the most shared publications displayed at the top.
   - **Value**: This feature highlights trending papers and offers insight into which publications are gaining the most popularity

​

## Instructions

A user accessing this page for the first time will be greeted with a page with two questions asking about which topics they are interested in. User can click on several topics to narrow down what their interests are. After submitting these interests, the feed will be customized with these specific topics. The main feed will be scrollable so that users can explore their topic of interest. On the right hand side of the page, there will be a Topics section where user can adjust their interests. Below the Topics section there will be a Filters section, where the user can specify certain words to include or exclude from the search results. Then, there will be a Date Range section where the user can set a date range for the publication dates. Lastly, there will be a sorting section where user can choose to sort by the number of shares or citations the article got.

When a user clicks into an article, the user will be able to read the abstract to the article with a button to read the full article. The page will display the title, the organization, and the authors of the article. Below the abstract, there will be a Similar Papers section where the user can view similar articles.

## Development Requirements

### Technical Requirements

- **Operating System**: macOS, Linux, or Windows
- **Programming Language**: JavaScript
- **Frontend Libraries**:
  - React
  - Redux
  - Next.js
- **Backend Libraries**:
  - Express.js
  - Node.js
- **Database**: PostgreSQL
- **Other Tools**:
  - Docker
  - YAML for CI/CD pipelines

### Setup Instructions

1. **Clone the Repository**:
   ```
   git clone https://github.com/csc301-2024-f/project-17-computational-bio-lab-ccbr.git
   cd project-17-computational-bio-lab-ccbr
   ```
   
2. **Install Dependencies**
   ```
   npm install
   ```

3. **Set up environment variables:**
   Create a .env file in the root directory and add necessary environment variables

4. **Run the Application**
   ```
   npm run dev
   ```

5. **Docker Set up:**
   ```
   docker-compose build
   docker-compose up
   ```

## Deployment and Github Workflow

### Git/GitHub Workflow

1. **Branching Strategy**:

   - We use a trunk based branching with `main` branch for development and will always be deployable.
   - Feature ranches are created from `main` and are named using the format `feature/feature-name`.
   - Bugs are fixed using branches and are named using the format `bug/bug-description`.

2. **Pull Requests**:

   - Pull requests are created from feature branches or bugs branches to the `main` branch.
   - Each pull requests are reviewed by at least one other team member of the same team (frontend / backend).
   - The team leaders / product managers are responsible for merging the reviewed pull requests.

3. **Code Reviews**:
   - Code reviews are mandatory for all pull requests by at least one other person.
   - Reviewers check for code quality, organization, and bugs.

-**Justification**: Many companies now use trunk based branching so we will be following this trend. Code reviews and merging ensures code quality and reduces the likelihood of bugs reaching production. Lastly, having consistent naming makes organization of tasks and reviewing code easier.

### Deployment Tools

- **Docker**: Used for containerizing the application, which ensures consistency across different environments.
- **Justification**: Docker provides a consistent environment for the application, making it easier to manage dependencies and configurations.
- **CI/CD Pipelines**: YAML pipelines automate testing and deployment, which ensures continuous integration and delivery.
- **Justification**: CI/CD pipelines automate repetitive tasks, speeding up the development and deployment process while maintaining high quality.

## Coding Standards and Guidelines

We adhere to coding standards and guidelines to ensure our code is consistent, readable, and maintainable across the team. These standards help reduce complexity, improve code quality, and make debugging and collaboration easier. By keeping naming, indentation, and documentation practices consistent, we promote best practices and improves overall development efficiency, making it simpler for team members to collaborate.
​

## Licenses

The Partner has used [Creative Commons Corporation (CCO) License](https://creativecommons.org/publicdomain/zero/1.0/legalcode) for projects before and proposed it for this project as well. 