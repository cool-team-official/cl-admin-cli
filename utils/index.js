const fs = require("fs");

function copy(src, dst) {
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }

        paths.forEach(function (path) {
            let _src = src + '/' + path;
            let _dst = dst + '/' + path;
            let readable;
            let writable;

            fs.stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }

                if (st.isFile()) {
                    readable = fs.createReadStream(_src);
                    writable = fs.createWriteStream(_dst);
                    readable.pipe(writable);
                } else if (st.isDirectory()) {
                    copy(_src, _dst);
                }
            });
        });
    });
}

module.exports = {
    copy
}