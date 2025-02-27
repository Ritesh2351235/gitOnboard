-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "FirstName" TEXT,
    "LastName" TEXT,
    "imageUrl" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 150,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToProject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "UserToProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sourceCodeEmbedding" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "SummaryEmbedding" vector(768),
    "sourceCode" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "sourceCodeEmbedding_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserToProject_userId_projectId_key" ON "UserToProject"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sourceCodeEmbedding" ADD CONSTRAINT "sourceCodeEmbedding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanCard" ADD CONSTRAINT "KanbanCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
