interface IBlog {
  id: string;
  user: string;
  title: string;
  titlePreview: string;
  content: string;
  contentPreview: String;
  lastEdited: Date;
  isDeleted: boolean;
  blobUri: string;
  blobName: string;
  positionIndex: number;
  tags: string[];
  quote: string;
}

export { IBlog };
