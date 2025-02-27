/*
  Warnings:

  - You are about to drop the `KanbanCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KanbanCard" DROP CONSTRAINT "KanbanCard_userId_fkey";

-- DropTable
DROP TABLE "KanbanCard";
