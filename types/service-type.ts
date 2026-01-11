export interface ILastNews {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface INews {
  id: string;
  titleKr: string;
  titleUz: string;
  slug: string;
  descriptionKr: {
    html: string;
  };
  descriptionUz: {
    html: string;
  };
  image: {
    url: string;
  };
  categories: {
    slug: string;
    title: string;
  }[];
  createdAt: string;
}

export interface ICategorie {
  id: string;
  slug: string;
  title: string;
  news: {
    id: string;
  }[];
}

export interface CategorieTag {
  title: string;
  slug: string;
}

export interface ICategorieNews {
  id: string;
  title: string;
  slug: string;
  news: INews[];
}

// Employee interfaces
export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  birthDate: string;
  position?: string;
  isActive: boolean;
}

export interface IHonoraryEmployee {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  position?: string;
  startDate: string;
  endDate: string;
  workPeriod?: string;
  isActive: boolean;
}

export interface IEvent {
  id: string;
  title: string;
  photos: string[];
  description?: string;
  eventDate: string;
  isActive: boolean;
}
