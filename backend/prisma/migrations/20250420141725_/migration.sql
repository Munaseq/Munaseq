-- AlterTable
ALTER TABLE "_AssociatedWith" ADD CONSTRAINT "_AssociatedWith_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AssociatedWith_AB_unique";

-- AlterTable
ALTER TABLE "_EventModerators" ADD CONSTRAINT "_EventModerators_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EventModerators_AB_unique";

-- AlterTable
ALTER TABLE "_EventPresenters" ADD CONSTRAINT "_EventPresenters_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EventPresenters_AB_unique";

-- AlterTable
ALTER TABLE "_UserEventsJoined" ADD CONSTRAINT "_UserEventsJoined_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserEventsJoined_AB_unique";
