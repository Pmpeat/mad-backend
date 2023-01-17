const db = require("../../models");
const applicantDB = db.applicants;
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const __basedir = path.resolve();
const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let applicants = [];

      rows.forEach((row) => {
        let applicant = {
            jobApplicationType: row[1],
            gender: row[2],
            name: row[3],
            idCode: row[4],
            dateOfBirth: row[5],
            status: row[6],
            address: row[7],
            congenitalDisease: row[8],
            mobile: row[9],
            emergencyContact: row[10],
            refEmployee: row[11],
            portfolio: row[12],
            portfolioLink: row[13],
            military: row[14],
            talent: row[15],
            drivingAbility: row[16],
            motorcycle: row[17],
            thai: row[18],
            eng: row[19],
            iosSystem: row[20],
            pcSystem: row[21],
            officeEquipment: row[22],
            workInOther: row[23],
            position: row[24],
            expectedSalary: row[25],
            expectedIncome: row[26],
            target: row[27],
            successPride: row[28],
            peopleDontKnow: row[29],
            interest: row[30],
            newsFrom: row[31],
            aboutYou: row[32],
        };

        applicants.push(applicant);
      });

      applicantDB.bulkCreate(applicants)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " +  req.file.filename,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " +  req.file.filename,
    });
  }
};

const getApplicants = (req, res) => {
    applicantDB.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

module.exports = {
  upload,
  getApplicants,
};