export interface User{
  id: string;
}

export interface IFile {
  _id: string;
  name: string;
  extension: string;
}

export interface INews {
  _id: string;
  author: string;
  title: string;
  body: string;
  publishedAt: string;
  files: IFile[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}