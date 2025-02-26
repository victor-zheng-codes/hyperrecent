/*
  Warnings:

  - A unique constraint covering the columns `[version,link]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firstName,lastName]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `version` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Article_link_key";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "version" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Article_version_link_key" ON "Article"("version", "link");

-- CreateIndex
CREATE UNIQUE INDEX "Author_firstName_lastName_key" ON "Author"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");
