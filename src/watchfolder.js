const chokidar = require("chokidar");
const log = require("./services/logger.service");
const FileIndex = require("./util/fileIndex");
const FileUtils = require('./util/fileUtils');
const FileRecognizer = require("./util/fileRecognizer");
const options = require("./util/cmdargs").parseArguments();
const Publisher = require("./amqp/publisher");
const Generator = require("./util/messageGenerator");
const fs = require("fs");

const generator = new Generator(options);
const publisher = new Publisher(options);
const fileindex = new FileIndex(options, new FileRecognizer(options), publisher, generator);


let parentFolderStat = fs.statSync(options.folder);
let uid = parentFolderStat.uid;
let gid = parentFolderStat.gid;
let mode = parentFolderStat.mode;

FileUtils.createDirectory(FileUtils.createFullPath(options.folder, options.PROCESSING_FOLDER_NAME), uid, gid, mode);
FileUtils.createDirectory(FileUtils.createFullPath(options.folder, options.INCOMPLETE_FOLDER_NAME), uid, gid, mode);
FileUtils.createDirectory(FileUtils.createFullPath(options.folder, options.REFUSED_FOLDER_NAME), uid, gid, mode);

chokidar.watch(
    options.folder,
    {
        ignored: (path) => {
            // Ignore sub-folders
            return RegExp(options.folder + '.+/').test(path)
        },
        usePolling: false,
        alwaysStat: false,
        awaitWriteFinish: true
    })
    .on('add', (path) => {
        fileindex.add_file(path, fileindex.determine_file_type(path, options), options, publisher, generator);
    }
);
log.success('Watching folder: ' + options.folder);