const fs = require("fs");

const phpIniPath = "C:/Users/anrose.id/.config/herd/bin/php85/php.ini";

let ini = fs.readFileSync(phpIniPath, "utf8");

function setIniLine(key, value) {
    const re = new RegExp("^\\s*;?\\s*" + key + "\\s*=.*$", "mi");
    const line = `${key} = ${value}`;

    if (re.test(ini)) {
        ini = ini.replace(re, line);
    } else {
        ini += `\r\n${line}`;
    }
}

setIniLine("file_uploads", "On");
setIniLine("upload_tmp_dir", "\"C:/Users/anrose.id/AppData/Local/Temp\"");
setIniLine("sys_temp_dir", "\"C:/Users/anrose.id/AppData/Local/Temp\"");
setIniLine("upload_max_filesize", "20M");
setIniLine("post_max_size", "25M");

fs.writeFileSync(phpIniPath, ini);
console.log("Updated:", phpIniPath);
