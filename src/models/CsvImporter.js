import csv from 'csv'
const fs = window.require('fs')

class CsvImporter {
  constructor(path, season, accountID) {
    this.path = path
    this.season = season
    this.accountID = accountID
  }

  readFile() {
    return new Promise((resolve, reject) => {
      console.log('reading', this.path)
      fs.readFile(this.path, 'latin1', (err, data) => {
        if (err) {
          console.error('failed to read file', this.path, err)
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  import() {
    return new Promise((resolve, reject) => {
      this.readFile().then(lines => {
        const options = { columns: true }
        csv.parse(lines, options, (err, data) => {
          if (err) {
            console.error('failed to import CSV file', this.path, err)
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
    })
  }
}

export default CsvImporter
