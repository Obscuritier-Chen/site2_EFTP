const uuid=require('uuid');
const Busboy=require('busboy');
const path=require('path');
const fs=require('fs');

const uploadToken=new Map();

const uploadDir = path.join(__dirname, '../../uploads');

async function checkFileUploadMiddleware(ctx, next)
{
    if(ctx.request.method === 'POST' && ctx.request.headers['content-type'] && ctx.request.headers['content-type'].startsWith('multipart/form-data')) {
        return new Promise((resolve, reject) => {
            const maxFilesSize = 524288000; // 500MB
            const busboy = Busboy({ headers: ctx.request.headers, limits: {fileSize: maxFilesSize} });
            let fileInfo = null;
            let fileCount = 0;
            let token;
            let currentFileSize = 0;
            let currentFilesNum = 0;
            let hasError = false;

            busboy.on('field', (fieldname, value) => {
                if (fieldname === 'token') {
                    token = value;
                }
            });

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                filename=filename.filename;//懒得正常解决了 我也不知道为啥filename是个字典
        
                fileCount++;

                if (fileCount > 1) {
                    hasError = true;
                    file.destroy();
                    return reject({ code: 5, message: 'only one file is allowed' });
                }

                if (!token) {
                    hasError = true;
                    file.destroy();
                    return reject({ code: 3, message: 'lack info' });
                }

                const tokenContent = uploadToken.get(token);
                if (!tokenContent) {
                    hasError = true;
                    file.destroy();
                    return reject({ code: 4, message: 'invalid token' });
                }

                currentFileSize = tokenContent.currentFilesSize || 0;
                currentFilesNum = tokenContent.currentFilesNum || 0;
                let filesNum = tokenContent.filesNum || 1;

                if (currentFileSize + file.size > maxFilesSize || currentFilesNum + 1 > filesNum) {
                    hasError = true;
                    file.destroy();
                    return reject({ code: 2, message: 'file exceed limit' });
                }
                currentFileSize += file.size;
                currentFilesNum++;

                file.on('limit', () => {
                  hasError = true;
                  file.destroy();
                  reject({ code: 1, message: 'file exceed limit'});
                });

                const newFilename = uuid.v4() + path.extname(filename);
                const saveTo = path.join(uploadDir, newFilename);
                const writeStream = fs.createWriteStream(saveTo);
                file.pipe(writeStream);

                fileInfo = {
                    size: 0,
                    originalFilename: filename,
                    newFilename: newFilename,
                };
                file.on('data', (data) => {
                    fileInfo.size += data.length;
                });
            });

            busboy.on('finish', () => {
                if (hasError) return;
                if (!fileInfo){
                    return reject({ code: 2, message: 'lack info' });
                }
                if(!token){
                    return reject({ code: 2, message: 'lack info' });
                }
                const tokenContent = uploadToken.get(token);
                if (!tokenContent) {
                    return reject({ code: 3, message: 'invalid token' });
                }
                tokenContent.currentFilesSize = currentFileSize;
                tokenContent.currentFilesNum = currentFilesNum;
                uploadToken.set(token, tokenContent);
                ctx.request.files = { file: fileInfo }; // 存储文件信息
                ctx.request.body = {token};
                resolve(next());
            });

            busboy.on('error', (err) => {
                hasError = true;
                reject(err);
            });

            ctx.req.pipe(busboy);
        })
        .catch(err => {
            if(err.code)
            {
                ctx.status = 400;
                ctx.body = {
                    code: err.code,
                    message: err.message
                };
            }
            else
            {
                throw err;
            }
        });
    }
    else
        await next();
}

module.exports={ checkFileUploadMiddleware, uploadToken };