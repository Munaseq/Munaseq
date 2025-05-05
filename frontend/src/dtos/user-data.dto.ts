import { Category } from "@/util/categories";

export interface UserDataDto {
  id: string;
  firstName: string;
  lastName: string;
  visibleName?: string;
  email: string;
  username: string;
  gender?: string;
  cvUrl?: string;
  profilePictureUrl?: string;
  socialAccounts?: {
    xLink?: string;
    linkedinLink?: string;
  };
  categories: Category[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  rating?: number;
}
