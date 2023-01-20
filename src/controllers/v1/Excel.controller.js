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

    let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let applicants = [];

      rows.forEach((row) => {
        let applicant = {
            jobApplicationType: row[1],
            gender: row[2],
            name: row[3],
            email: row[4],
            idCode: row[5],
            dateOfBirth: row[6],
            status: row[7],
            address: row[8],
            congenitalDisease: row[9],
            mobile: row[10],
            emergencyContact: row[11],
            refEmployee: row[12],
            portfolio: row[13],
            avatar: row[14],
            portfolioLink: row[15],
            military: row[16],
            talent: row[17],
            drivingAbility: row[18],
            motorcycle: row[19],
            thai: row[20],
            eng: row[21],
            iosSystem: row[22],
            pcSystem: row[23],
            officeEquipment: row[24],
            workInOther: row[25],
            position: row[26],
            expectedSalary: row[27],
            expectedIncome: row[28],
            target: row[29],
            successPride: row[30],
            peopleDontKnow: row[31],
            interest: row[32],
            newsFrom: row[33],
            aboutYou: row[34],
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