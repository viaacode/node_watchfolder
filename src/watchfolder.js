const chokidar = require("chokidar");
const log = require("./services/logger.service");
const FileIndex = require("./util/fileIndex");
const FileRecognizer = require("./util/fileRecognizer");
const options = require("./util/cmdargs").parseArguments();
const Publisher = require("./amqp/publisher");
const Generator = require("./util/messageGenerator");
const fs = require("fs");

const generator = new Generator(options);
const publisher = new Publisher(options);
const fileindex = new FileIndex(options, new FileRecognizer(options), publisher, generator);

log.success('Watching folder: ' + options.folder);
chokidar.watch(options.folder,
    {
        ignored: (path) => {
            // Ignore sub-folders
            return RegExp(options.folder + '.+/').test(path)
        },
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 500
        },
        usePolling: true,
        interval: 500,
        binaryInterval: 500,
        useFsEvents: true
    })
    .on('add', (path) => {
        fileindex.add_file(path, fileindex.determine_file_type(path, options), options, publisher, generator);
    })
    .on('all', (event, path) => {
        console.log('ALL: ', event, ' - ', path);
    });