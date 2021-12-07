const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fsAsync = Promise.promisifyAll(require('fs'));

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //get a unique id
  //write a file with that unique ID as the filename and the text as data in the data directory.
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        throw ('error writing text');
      } else {
        callback(null, { id, text });
      }
    });
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
//inputs: callback
//outputs: An array of objects that have an id and a text field.
//convert the current function into a promises version.
  return fsAsync.readdir(exports.dataDir)
    .then(files => {
      var data = _.map(files, (file) => {
        id = path.basename(file, '.txt');
        return { id, text: id };
      });
    })
    .catch(err => {
      console.log('error reading all files');
    });

  //   (err, files) =>{
  //   if (err) {
  //     throw ('error reading from directory');
  //   } else {
  //     //create an empty array
  //     //push each file that we're reading into the empty array
  //     //once that loop completes, run promise.all on the array and
  //     //return that array to the user.
  //     var data = _.map(files, (file) => {
  //       id = path.basename(file, '.txt');
  //       return { id, text: id };

  //     });
  //     callback(null, data);
  //   }
  // });
};

exports.readOne = (id, callback) => {
  //fs readFile on the the file with the same id filename in exports.dataDir.
  //invoke the callback using the data we retrieved as text and the id we were given as the id.
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, filedata) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var text = String(filedata);
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) =>{
    if (err) {
      throw ('error reading from directory');
    } else {
      var data = _.map(files, (file) => {
        trimmedFilename = path.basename(file, '.txt');
        return trimmedFilename;
      });
      if (!data.includes(id)) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
          if (err) {
            throw ('error updating file');
          } else {
            callback(null, { id, text });
          }
        });
      }
    }
  });
};

exports.delete = (id, callback) => {
  //fs.unlink(filepath, callback(error));
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};