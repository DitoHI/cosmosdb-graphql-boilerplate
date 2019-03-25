interface IBlog {
  id: string;
  user: string;
  title: string;
  content: string;
  lastEdited: Date;
  isDeleted: boolean;
  imageUri: string[];
  positionIndex: number;
  hastag: string;
}

export { IBlog };
