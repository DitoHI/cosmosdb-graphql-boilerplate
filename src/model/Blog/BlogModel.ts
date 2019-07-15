interface IBlog {
  id: string;
  user: string;
  title: string;
  content: string;
  lastEdited: Date;
  isDeleted: boolean;
  blobUri: string;
  blobName: string;
  positionIndex: number;
  tags: string[];
}

export { IBlog };
