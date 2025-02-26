-- CreateTable
CREATE TABLE "Article" (
    "articleId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "link" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "isPreprint" BOOLEAN NOT NULL,
    "firstAuthorId" INTEGER NOT NULL,
    "lastAuthorId" INTEGER NOT NULL,
    "authorList" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "server" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("articleId")
);

-- CreateTable
CREATE TABLE "Topic" (
    "topicId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "ArticleTopic" (
    "articleTopicId" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "ArticleTopic_pkey" PRIMARY KEY ("articleTopicId")
);

-- CreateTable
CREATE TABLE "SubTopic" (
    "subTopicId" SERIAL NOT NULL,
    "parentTopicId" INTEGER NOT NULL,
    "childTopicId" INTEGER NOT NULL,

    CONSTRAINT "SubTopic_pkey" PRIMARY KEY ("subTopicId")
);

-- CreateTable
CREATE TABLE "Author" (
    "authorId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("authorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_link_key" ON "Article"("link");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_firstAuthorId_fkey" FOREIGN KEY ("firstAuthorId") REFERENCES "Author"("authorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_lastAuthorId_fkey" FOREIGN KEY ("lastAuthorId") REFERENCES "Author"("authorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTopic" ADD CONSTRAINT "ArticleTopic_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("articleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleTopic" ADD CONSTRAINT "ArticleTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTopic" ADD CONSTRAINT "SubTopic_parentTopicId_fkey" FOREIGN KEY ("parentTopicId") REFERENCES "Topic"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTopic" ADD CONSTRAINT "SubTopic_childTopicId_fkey" FOREIGN KEY ("childTopicId") REFERENCES "Topic"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;
