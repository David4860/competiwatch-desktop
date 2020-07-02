import isElectron from "is-electron";

export function setTitle(title) {
  if (isElectron()) {
    window.ipcRenderer.send("title", title);
  }
}

export function showSaveDialog(options) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      window.remote.dialog.showSaveDialog(options).then(resolve, reject);
    } else {
      reject("not electron, cannot show save dialog");
    }
  });
}

export function openLinkInBrowser(url) {
  if (isElectron()) {
    window.shell.openExternal(url);
  }
}

export function getAppName() {
  if (isElectron() && window.remote.app) {
    return window.remote.app.getName();
  }
  return "Competiwatch";
}

export function openInExplorer(dbPath) {
  if (isElectron()) {
    window.shell.showItemInFolder(dbPath);
  }
}

export function getDbPath(replyTo, dbName, handler) {
  if (isElectron()) {
    window.ipcRenderer.once(replyTo, handler);
    window.ipcRenderer.send("get-db-path", replyTo, dbName);
  }
}

const getSignature = prefix => {
  return (
    prefix +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export function findLatest(dbName, conditions, sort) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const replyTo = getSignature("find-latest");
      window.ipcRenderer.once(replyTo, (event, err, rows) => {
        if (err) {
          console.error("failed to load latest record", dbName, err);
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
      window.ipcRenderer.send("find-latest", replyTo, dbName, conditions, sort);
    } else {
      reject("not electron");
    }
  });
}

export function findOne(dbName, conditions) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const replyTo = getSignature("find-one");
      window.ipcRenderer.once(replyTo, (event, err, data) => {
        if (err) {
          console.error("failed to look up a record", conditions, err);
          reject(err);
        } else {
          resolve(data);
        }
      });
      window.ipcRenderer.send("find-one", replyTo, dbName, conditions);
    } else {
      reject("not electron");
    }
  });
}

export function count(dbName, conditions) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const replyTo = getSignature("count");
      window.ipcRenderer.once(replyTo, (event, err, count) => {
        if (err) {
          console.error("failed to count records", err);
        } else {
          resolve(count);
        }
      });
      window.ipcRenderer.send("count", replyTo, dbName, conditions);
    } else {
      reject("not electron");
    }
  });
}

export function findAll(dbName, sort, conditions) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const replyTo = getSignature("find-all");
      window.ipcRenderer.once(replyTo, (event, err, rows, val) => {
        if (err) {
          console.error("failed to look up records", dbName, err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
      window.ipcRenderer.send("find-all", replyTo, dbName, sort, conditions);
    } else {
      reject("not electron");
    }
  });
}

export function deleteSome(dbName, conditions) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const replyTo = getSignature("delete");
      window.ipcRenderer.once(replyTo, (event, err, numRemoved) => {
        if (err) {
          console.error("failed to delete record(s)", dbName, conditions);
          reject();
        } else {
          console.log("deleted", numRemoved, dbName, "record(s)", conditions);
          resolve();
        }
      });
      const options = {};
      window.ipcRenderer.send("delete", replyTo, dbName, conditions, options);
    } else {
      reject("not electron");
    }
  });
}

export function update(dbName, data, id) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const conditions = { _id: id };
      const options = {};
      const update = { $set: data };
      const replyTo = getSignature("update");
      window.ipcRenderer.once(replyTo, (event, err, numReplaced) => {
        if (err) {
          console.error("failed to update record", dbName, id, err);
          reject(err);
        } else {
          console.log("updated", numReplaced, "record", dbName, id);
          resolve({ _id: id });
        }
      });
      window.ipcRenderer.send(
        "update",
        replyTo,
        dbName,
        conditions,
        update,
        options
      );
    } else {
      reject("not electron");
    }
  });
}

export function insert(dbName, data) {
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const replyTo = getSignature("insert");
      const createdDate = new Date();
      data.createdAt = createdDate.toJSON();
      const rows = [data];
      window.ipcRenderer.once(replyTo, (event, err, newRecords) => {
        if (err) {
          console.error("failed to create record", dbName, data, err);
          reject(err);
        } else {
          const newRecord = newRecords[0];
          newRecord.createdAt = createdDate;
          console.log("created record", dbName, newRecord);
          resolve(newRecord);
        }
      });
      window.ipcRenderer.send("insert", replyTo, dbName, rows);
    } else {
      reject("not electron");
    }
  });
}

export function readFile(path) {
  return new Promise((resolve, reject) => {
    console.log("reading", path);
    if (isElectron()) {
      window.fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error("failed to read file", path, err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    } else {
      reject("not electron, cannot read file from filesystem");
    }
  });
}

export function writeFile(path, contents) {
  return new Promise((resolve, reject) => {
    console.log("saving", path);
    if (isElectron()) {
      window.fs.writeFile(path, contents, err => {
        if (err) {
          console.error("failed to save file", path);
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      reject("not electron, cannot write to filesystem");
    }
  });
}

export function setAppMenu(template) {
  if (isElectron() && window.remote.Menu) {
    const menu = window.remote.Menu.buildFromTemplate(template);
    window.remote.Menu.setApplicationMenu(menu);
  }
}

export function quit() {
  if (isElectron()) {
    window.remote.app.quit();
  }
}

export function toggleDevTools(win) {
  if (win) {
    win.webContents.toggleDevTools();
  }
}
