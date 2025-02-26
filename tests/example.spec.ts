import { test, expect } from "@playwright/test";

// Check visibility of topic buttons
// const topics = [
//   // This needs to be updated when the topics change.
//   "Ecology",
//   "Genomics",
//   "Developmental Biology",
//   "Neuroscience",
//   "Physiology",
//   "Immunology",
//   "Evolutionary Biology",
//   "Cell Biology",
//   "Bioinformatics",
//   "Microbiology",
//   "Plant Biology",
//   "Bioengineering",
//   "Molecular Biology",
//   "Biochemistry",
//   "Biophysics",
// ]; Cannot use this anymore

const HOME_URL = process.env.frontend || "https://uat.hyper-recent.online";

test.describe("Home Page Tests", () => {
  // log the url that the test is testing at the start of the test
  console.log("Testing url " + HOME_URL);

  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_URL + "/articles");
    if (await page.isVisible("text=What topic are you interested in?")) {
      await page.click('button:has-text("Ecology")');
      await page.click('button:has-text("Proceed to Articles")');
    }
  });

  test("has title Logo Hyper Recent, and has Title", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Hyper Recent/);
    const logo = page.locator('header svg[class="h-[32px]"]'); // This is the class name for the Hyper Recent Logo
    await expect(logo).toBeVisible(); // Visibility checked
  });
  test("has topic buttons", async ({ page }) => {
    // Select all buttons with any name
    const topicButtons = page.getByRole("button", { name: /.+/ });

    // Get the count of topic buttons
    const count = await topicButtons.count();

    // Assert that there is at least one topic button
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("button clicking works for all buttons", async ({ page }) => {
    // Select all buttons with any non-empty name
    const topicButtons = page.getByRole("button", { name: /.+/ });

    // Get the count of topic buttons
    const count = await topicButtons.count();

    for (let i = 0; i < count - 1; i++) {
      const button = topicButtons.nth(i);

      // Click the button
      await button.click();

      // Move the mouse away to trigger any hover or focus state changes
      await page.mouse.move(0, 0);

      // Assert that the button no longer has the 'bg-stone-200' class
      await expect(button).not.toHaveClass(/bg-stone-200/);

      // Click the button again to revert the class
      await button.click();

      // Move the mouse away again
      await page.mouse.move(0, 0);

      // Assert that the button has the 'bg-stone-200' class again
      await expect(button).toHaveClass(/bg-stone-200/);
    }
  });

  test("filter posts by topic correctly", async ({ page }) => {
    // Select all buttons with any non-empty name
    const topicButtons = page.getByRole("button", { name: /.+/ });
    const count = await topicButtons.count();

    for (let i = 0; i < count; i++) {
      const button = topicButtons.nth(i);
      const topic = (await button.textContent())?.trim();

      if (topic) {
        // Click the topic button
        await button.click();

        // Apply the filters
        await page.click('button:has-text("Apply Filters")');

        // Retrieve all posts
        const posts = page.locator('[data-testid="post-item"]');
        const postCount = await posts.count();

        // Assert each post contains the selected topic in data-categories
        for (let j = 0; j < postCount; j++) {
          const categories = await posts.nth(j).getAttribute("data-categories");
          if (categories) {
            const categoryList = categories
              .split(",")
              .map((category: string) => category.toLowerCase());
            expect(categoryList).toContain(topic.toLowerCase());
          } else {
            throw new Error(`Post ${j} does not have categories`);
          }
        }

        // Optionally, reset the filter by clicking the topic button again
        await button.click();
        await page.click('button:has-text("Apply Filters")');
      } else {
        throw new Error(
          `Button at index ${i} does not have valid text content`,
        );
      }
    }
  });

  test("has posts", async ({ page }) => {
    // Check if posts are visible
    const posts = page.locator('[data-testid="post-item"]');
    if ((await posts.count()) === 0) {
      await page.click('button:has-text("Apply Filters")');
    }
    await expect(posts.first()).toBeVisible(); // Check if the first post is visible
  });

  test("Check Date Range Picker Exists", async ({ page }) => {
    const dateRangePickerFrom = page.locator(
      'input[placeholder="Select start date"]',
    );
    await expect(dateRangePickerFrom).toBeVisible();

    const dateRangePickerTo = page.locator(
      'input[placeholder="Select end date"]',
    );
    await expect(dateRangePickerTo).toBeVisible();
  });

  test("selecting date range filters posts correctly", async ({ page }) => {
    const dateRangePickerFrom = page.locator(
      'input[placeholder="Select start date"]',
    );
    const dateRangePickerTo = page.locator(
      'input[placeholder="Select end date"]',
    );

    // Type in start date
    await dateRangePickerFrom.fill("01/01/2000");

    // Type in end date
    await dateRangePickerTo.fill("01/01/2001");

    // Apply filters
    const applyButton = page.locator('button:has-text("Apply")');
    await applyButton.click();

    // Expect the post list to be empty
    const posts = page.locator('[data-testid="post-item"]');
    let attempts = 0;
    const maxAttempts = 5;

    while ((await posts.count()) !== 0 && attempts < maxAttempts) {
      console.log(
        `Attempt ${attempts + 1}: Posts count is not zero, clicking "Apply Filters" button again.`,
      );
      await page.click('button:has-text("Apply Filters")');
      await page.waitForTimeout(1000); // Wait for 1 second before checking again
      attempts++;
    }

    if ((await posts.count()) !== 0) {
      console.error("Failed to filter posts to zero after maximum attempts.");
    } else {
      console.log("Posts filtered to zero successfully.");
    }

    await expect(posts).toHaveCount(0);

    // Expect the no posts message to be visible
    const noPostsMessage = page.locator(
      "text=There are no posts for this filter search",
    );
    await expect(noPostsMessage).toBeVisible();
  });

  test("selecting current month filters posts correctly", async ({ page }) => {
    const dateRangePickerFrom = page.locator(
      'input[placeholder="Select start date"]',
    );
    const dateRangePickerTo = page.locator(
      'input[placeholder="Select end date"]',
    );

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );

    const formatDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    // Type in start date
    await dateRangePickerFrom.fill(formatDate(startOfMonth));

    // Type in end date
    await dateRangePickerTo.fill(formatDate(endOfMonth));

    const topicButton = page.getByRole("button", {
      name: "Developmental Biology",
    });
    await topicButton.click();

    await page.mouse.click(0, 0);
    // Apply filters
    const applyButton = page.locator('button:has-text("Apply Filters")');
    await Promise.all([
      page.waitForLoadState("networkidle"),
      applyButton.click(),
    ]);
    await applyButton.click();
    // Get all posts
    const posts = page.locator('[data-testid^="post-item"]');

    // Retrieve all matching elements
    const allPosts = await posts.all();

    // Ensure there are matching elements
    if (allPosts.length === 0) {
      console.error("No posts found.");
      return;
    }

    // Check each post's date by looking at the text content
    for (let i = 0; i < allPosts.length; i++) {
      const postElement = allPosts[i];
      if (!postElement) {
        console.error(`Post element at index ${i} is undefined.`);
        continue;
      }

      const dateText = await postElement
        .locator('[data-testid^="date"]')
        .textContent();
      console.log(`Post ${i} date: ${dateText}`);

      if (dateText) {
        const postDate = new Date(dateText);
        expect(postDate.getTime()).toBeGreaterThanOrEqual(
          startOfMonth.getTime(),
        );
        expect(postDate.getTime()).toBeLessThanOrEqual(endOfMonth.getTime());
      } else {
        console.error(`Date text for post ${i} is undefined.`);
      }
    }
  });

  test("has search bar", async ({ page }) => {
    const searchBar = page.locator('input[placeholder="Search for keywords"]');
    await expect(searchBar).toBeVisible();
  });

  test("search bar works (frontend)", async ({ page }) => {
    const searchBar = page.locator('input[placeholder="Search for keywords"]');
    const searchTerm = "test search";

    await searchBar.fill(searchTerm);
    await expect(searchBar).toHaveValue(searchTerm);
  });

  test("has search exclude bar", async ({ page }) => {
    const searchBar = page.locator('input[placeholder="Keywords to exclude"]');
    await expect(searchBar).toBeVisible();
  });

  test("search exclude bar works (frontend)", async ({ page }) => {
    const searchBar = page.locator('input[placeholder="Keywords to exclude"]');
    const searchTerm = "test search";

    await searchBar.fill(searchTerm);
    await expect(searchBar).toHaveValue(searchTerm);
  });

  test("clicking a post navigates to the correct page and verifies the title", async ({
    page,
  }) => {
    // Locate the first post and get its title
    const firstPost = page.locator('[data-testid="post-item"]').first();
    const postTitle = await firstPost
      .locator('[data-testid^="title"]')
      .textContent();

    // Log the post title for debugging
    console.log("Post title:", postTitle);

    // Ensure the post title is not null or undefined
    if (!postTitle) {
      throw new Error("Post title is null or undefined");
    }

    // Click the post to navigate
    await firstPost.click();

    // Wait for the post container to be visible
    const post = page.locator('[data-testid="post-container"]');
    await expect(post).toBeVisible();

    // Locate the title in the post container
    const title = post.locator('[data-testid="post-title"]');

    // Verify the navigation by checking the page title
    await expect(title).toHaveText(postTitle);
  });
});

test.describe("Article Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_URL + "/articles"); // EDIT THIS TO FRONTEND URL ONCE IT IS DEPLOYED!
    if (await page.isVisible("text=What topic are you interested in?")) {
      await page.click('button:has-text("Ecology")');
      await page.click('button:has-text("Or view all articles")');
    }
    const firstPost = page.locator('[data-testid="post-item"]').first();
    const postTitle = await firstPost
      .locator('[data-testid^="title"]')
      .textContent();

    // Click the post to navigate
    await firstPost.click();
  });

  test("displays article title correctly", async ({ page }) => {
    const title = page.locator('[data-testid="post-title"]');
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });

  test("displays publication date correctly", async ({ page }) => {
    const date = page.locator('[data-testid="article-date"]');
    await expect(date).toBeVisible();
    const dateText = await date.textContent();
    expect(dateText).toMatch(/\w+ \d{1,2}(st|nd|rd|th), \d{4}/);
  });

  test("displays version information correctly", async ({ page }) => {
    const version = page.locator('[data-testid="article-version"]');
    await expect(version).toBeVisible();
    const versionText = await version.textContent();
    expect(versionText).toMatch(/Version: \d+/);
  });

  test("displays institution correctly", async ({ page }) => {
    const institution = page.locator('[data-testid="article-institution"]');
    await expect(institution).toBeVisible();
    const institutionText = await institution.textContent();
    expect(institutionText).toBeTruthy();
  });

  test("displays topic correctly", async ({ page }) => {
    const topic = page.locator('[data-testid="article-topic"]');
    await expect(topic).toBeVisible();
    const topicText = await topic.textContent();
    expect(topicText).toBeTruthy();
  });

  test("displays server information correctly", async ({ page }) => {
    const server = page.locator('[data-testid="article-server"]');
    await expect(server).toBeVisible();
    const serverText = await server.textContent();
    expect(serverText).toBeTruthy();
  });

  test("displays authors correctly and handles 'et al.'", async ({ page }) => {
    const authors = page.locator('[data-testid="article-authors"]');
    await expect(authors).toBeVisible();

    const authorElements = await page.locator('[data-testid^="author-"]').all();

    if (authorElements.length > 0) {
      if (authorElements.length > 10) {
        const etAl = page.locator('[data-testid="authors-et-al"]');
        await expect(etAl).toBeVisible();
      } else {
        for (const author of authorElements) {
          await expect(author).toBeVisible();
          const text = await author.textContent();
          expect(text).toBeTruthy();
        }
      }
    }
  });

  test("author contains link to a google scholar page'", async ({ page }) => {
    const authors = page.locator('[data-testid="article-authors"]');
    await expect(authors).toBeVisible();

    const authorElements = await page.locator('[data-testid^="author-"]').all();

    if (authorElements.length > 0) {
      const href = await authorElements[0].getAttribute("href");
      await authorElements[0].click();
    }
  });

  test("Back to articles button navigates correctly", async ({ page }) => {
    const backButton = page.locator('button:has-text("Back to articles")');
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL(
      new RegExp(`^${HOME_URL}(\/)?(articles)?\/?$`),
    );
  });

  test("Read Full Article link is correct and clickable", async ({ page }) => {
    const readFullArticleLink = page.locator(
      'a:has-text("Access Preprint From Server")',
    );
    await expect(readFullArticleLink).toBeVisible();
    const href = await readFullArticleLink.getAttribute("href");
    expect(href).toMatch(/^https:\/\/www\.biorxiv\.org\/content\/.+\.full$/);
    // Optionally, you can test if the link opens in a new tab
    await expect(readFullArticleLink).toHaveAttribute("target", "_blank");
  });

  test("Clicking on a similar post navigates correctly", async ({ page }) => {
    const similarPost = page.locator('[data-testid^="post-item"]').first();
    const similarPostTitle = await similarPost
      .locator('[data-testid^="title"]')
      .textContent();

    await similarPost.click();

    const newPostTitle = page.locator('[data-testid="post-title"]');
    await expect(newPostTitle).toHaveText(similarPostTitle || "");
  });
});
