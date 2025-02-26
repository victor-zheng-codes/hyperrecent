# 17 Looks Good To Me

## Review & Retrospect

 * When: Tuesday, November 12, 2024
 * Where: Zoom

## Process - Reflection

### What worked well?

Several decisions and actions during the deliverable contributed to our success. 

1. Hosting a deliverable planning Zoom call. 
   * Assigning tasks to members early on allowed them to plan around their schedules. Additionally, members could choose what they wanted to work on and tickets were assigned according to each person's skill set. 
   * Setting deadlines on when things needed to be done helped keep team members on track.
   * See the [meeting minutes](deliverables/team/meetings/nov4_planning.pdf) from the planning session for more information.

2. Quick communication on Slack. 
   * Generally, team members responded within a quick timeframe, allowing  bugs to be resolved faster.

3. Hosting Zoom meetings the day before and due date of the deliverable allowed the team to work through last minute bugs faster together.
   * Since everyone's code is working together, it can be difficult to figure out bugs that aren't in your code. Team members were willing to hop on Zoom calls to work through bugs as a group, which allowed for them to be resolved quicker.

### What did not work well?

While some aspects of the process went smoothly, there were also challenges that we need to address moving forward.

1. There are conflicting objectives between the Partner Vision and the Course Requrirements.
   * Our Partner has requested that we keep our code as maintainable and documented as possible, so that he can continue to work with it once we leave. He has emphasized that he does not care for the product to have a database or be deployed. 
   * The requirements for deliverable 3 state that the product must be deployed (or show an attempt of deployment) in order to get above a 50% in the deployment section of the requirements. Additionally, deliverable 2 required that we have a functional database. 
   * In order to satisfy course requirements and our Partner's requests, we had to create a fully automated deployment for the course alongside a locally deployable server and database using Docker, which took a lot of time and resulted in many bugs along the way. See the Deployment section of the [README](README.md) for more details.

2. Merge conflicts took a long time to fix, specifically on the frontend.
   * Since the frontend shares a lot of files across features, it took a while to fix merge conflicts related to frontend work.


### Planned Changes

Looking ahead, we plan to make several changes to improve our workflow.

1. Make better use of GitHub actions and pull requests instead of committing directly to the deliverable branch.
   * We will use a trunk-based branching strategy off of main to minimize merge conflicts. Our releases will be branched off of main when a new version is complete.
   * Enforcing Pull Requests to have at least one reviewer will help ensure all features are complete and fit the requirements, as well as prevent bugs in the code getting released to our deployment branch.
   * When a bug is found, we will use [Issues](https://github.com/csc301-2024-f/project-17-computational-bio-lab-ccbr/issues) to document what needs to be fixed and how to reproduce the error. That way we can keep track of bugs and get them resolved quicker.

2. Frontend team to begin meeting regularly to discuss structure of the UI and how the code should be maintained.
   * Merge conflicts on the frontend took a while to resolve.
   * The backend team has been meeting weekly to discuss the organization of the backend and consolidate the database, which made merging a lot easier.

4. Team members will have access to all channels in Slack.
   * Since there are a lot of developers pushing code at the same time, there are numerous changes to code structure and implementation.
   * To ensure members stay informed on all aspects of the project, access to both frontend and backend channels will be granted to all members.

### Integration & Next Steps

To integrate the individual components from D2 we first separated the frontend and backend into different folders for separate Node.js apps, so that they could run on different servers. The backend API routes were pre-determined by the backend team prior to D2, so the most tedious part was integrating the frontend components and rerouting the API calls to make the servers work together. 

Overall, the majority of our team found that forcing the team to split our work was not beneficial to the development of our product. While forcing us to break the product down into user stories allowed us to experiment with different ways of implementing things, it resulted in a high amount of inconsistency across branches. Since there was a lot of overlapping work done differently, the merging process took a very long time.


## Product - Review

We presented our product to our partner on November 12. For the product demo, we prepared a brief presentation of the key features and current stack of the product.  We made sure to test the product ahead of time to ensure the demo went smoothly. Additionally, we created a locally deployable version of our product to demo to our partner as well, to emphasize the maintainability of our product to our partner.

During the demo, we were able to showcase all features of the product to the partner, including filtering by topic, searching by keyword, excluding by keyword, filtering by a date range, and accessing the full article information. We presented both our deployed and local version to our partner, and went over how to set up the local version. Our partner accepted all of the features, but there was a change request to improve the article information page, which we refined for our submitted version. Our partner also emphasized that for the next version they would like us to focus more on the user-experience aspect of the project, rather than the technical details of getting a server, hosting a large database, and building a stable backend. 

Through this process, we learned the importance of comprehensive and clear documentation for maintainability in the long run and accessibility for others to run themselves. Additionally, we realized the importance of ensuring our product is deployable well in advance, which will help improve future demos.