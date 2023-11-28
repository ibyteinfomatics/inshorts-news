import { extname } from 'path';

export const editFileName = (req, file, cb) => {
  const fileExtName = extname(file.originalname);
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = (today.getMonth() + 1).toString(); // Months start at 0!
  let dd = today.getDate().toString();

  if (parseInt(dd) < 10) dd = '0' + dd;
  if (parseInt(mm) < 10) mm = '0' + mm;

  const dateStamp = Date.now() + dd + '-' + mm + '-' + yyyy;
  cb(null, `${dateStamp}${fileExtName}`);
};

export const mediaFileFilter = (req, file, cb) => {
  if (file.originalname.match(/\.(jpg|jpeg|JPEG|png)$/)) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Only images allowed'
     cb(null,false);
  }
};