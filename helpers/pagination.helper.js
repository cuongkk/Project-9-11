// Phân trang
exports.pagination = async (model, find, req) => {
  const limitItems = 2;
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  const totalRecord = await model.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;
  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    limitItems: limitItems,
    skip: skip,
  };
  return pagination;
};
// Hết Phân trang
