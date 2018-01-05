import multer from 'multer';
import fs from 'fs';

import Defines from './../config'
import Redis from './../helpers/db/redis';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, Defines.TEMP_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[file.originalname.split('.').length - 2] +
            '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (['csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            req.fileValidationError = 'Invalid File Extension';
            return callback(null, false, new Error('Invalid File Extension'));
        }
        callback(null, true);
    }
}).single('file');


export default class UploadFile {
    static Upload(req, res) {
        upload(req, res, () => {
            if (req.fileValidationError) {
                res.render('index',{ title: 'uploaded invalid file' })
            }
            else {
                const filepath = req.file.path;
                let content = fs.readFileSync(filepath, 'utf8');
                let fileSep = content.split('\r\n');
                let storedata = [];
                for (let i = 0; i < fileSep.length; i++) {
                    storedata.push(fileSep[i].split(','))
                }
                Redis.hsetAsync("Table", 'csv', JSON.stringify(storedata)).then(data => {
                    res.render('list', {data: storedata})
                })
            }
        })
    }

    static list(req, res) {
        Redis.hgetAsync("Table", 'csv').then(data => {
            data = JSON.parse(data);
            res.render('list', {data: data});
        })
    }

}