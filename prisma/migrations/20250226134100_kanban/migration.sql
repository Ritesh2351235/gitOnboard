-- CreateTable
CREATE TABLE "KanbanCard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "bounty" INTEGER,
    "organization" TEXT,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "KanbanCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KanbanCard" ADD CONSTRAINT "KanbanCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
