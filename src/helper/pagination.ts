export const pagination = (query: any) => {
  const option: Record<string, any> = {};
  let { per_page } = query;
  const { page } = query;
  per_page = Number(per_page) || 10;
  if (Number(page) !== 0 && page) {
    option.take = per_page;
    option.skip = option.take * (Number(page) - 1);
  }
  return option;
};