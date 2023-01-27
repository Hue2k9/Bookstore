const authTypeEnum = ['local', 'google', 'facebook'];
const CategoryEnum = [
  'Textbook',
  'Novel',
  'Picture book',
  'Reference book',
  'Comic',
  'Poem',
  'Encyclopedia',
  'Dictionary',
  'Science fiction book',
  'Short story',
  'Comic',
];
const RoleEnum = ['user', 'admin'];
const FileExtensionEnum = ['.pdf', '.docx', '.doc', '.xls', '.xlsx', '.txt', '.pptx', '.ppt', '.png', '.jpg'];
module.exports = {
  authTypeEnum,
  CategoryEnum,
  FileExtensionEnum,
  RoleEnum,
};
