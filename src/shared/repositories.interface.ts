import { RootFilterQuery } from 'mongoose';

export interface ListResponse<E> {
  data: E[];
  total: number;
  pages: number;
  page: number;
}

export interface IRepository<I, O> {
  create(input: I): Promise<O>;
  update(id: string, input: O): Promise<{ _id: string | undefined }>;
  getOneByQuery(query: RootFilterQuery<I>): Promise<O | null>;
  delete(id: string): Promise<void>;
  list(
    query: { limit: number; skip: number; page: number; search?: string },
    filters: RootFilterQuery<I>,
  ): Promise<ListResponse<O>>;
}
