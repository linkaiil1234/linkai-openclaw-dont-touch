export type TPaginationQParams = {
  page?: string;
  limit?: string;
};

export type TPaginationResponse = {
  page: number;
  limit: number;
  total_pages: number;
  total_count: number;
};
