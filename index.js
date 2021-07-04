const rp = require("request-promise");
const fs = require("fs")
const moment = require("moment-timezone");
const { exec } = require("child_process");
const config = require("./config.json");


/**
 * @function makeMessage
 * @param {object} center - vaccine center
 * @param {string} vaccine - vaccine name
 * @param {string} date - available date
 * @returns {string} - A message with vaccine center details
 */
const makeMessage = (center, vaccine, date) => {
  return `
    Center: ${center.name}
    Address: ${center.address}
    Block: ${center.block_name}
    Pincode: ${center.block_name}
    Fee type: ${center.fee_type}
    Vaccine: ${vaccine}
    Date: ${date}
    Dose: ${center.dose}

    https://selfregistration.cowin.gov.in/
    `;
};

/**
 * @function sendMessage - execute shell script to send the message
 * @param {string} - A message with vaccine available centers' details
 */
const sendMessage = (message) => {
  exec(`./script.sh "${message}"`, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (err !== null) {
      console.log(`exec error: ${err}`);
    }
  });
};

/**
 * @function fetchData - Fetch data from the CDN and find available centers
 * @param {string} districtID
 */
const findVaccine =  async (districtID) => {
  try {
    const date = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
    options  = {...config}
    options.url += `?district_id=${districtID}&date=${date}`;
    const dataStr = await rp(options);
    const { centers } = JSON.parse(dataStr);
    const availableCenters = centers.filter((center) => {
      return center.sessions.some(
        (session) => {
          return (session.available_capacity_dose1 > 0 && session.min_age_limit === 18) || (
            session.available_capacity_dose2 > 0 && session.max_age_limit > 45 
          )
        }
      );
    }); // O(n*m)

    // prepare message
    if (availableCenters.length > 0) {
      let message = "   VACCINE AVAILABLE";
      message += availableCenters.reduce((acc, value) => {
        let vaccines = [];
        let dates = [];
        value.sessions.forEach((session) => {
          value.dose = session.available_capacity_dose1 > 0 ? 1 : 2
          if (!vaccines.some(vaccine => vaccine === session.vaccine)) vaccines.push(session.vaccine);
          if (!dates.some(date => date === session.date)) dates.push(session.date);
        });
        return acc + makeMessage(value, vaccines.toString(), dates.toString());
      }, ""); // O(p*m)
      sendMessage(message);
    }
  } catch(err) {
    console.log(err.message)
  }
} // O(m*(p+n))


/**
 * IIFE - Begin the execution here
 */
(async () => {
  const delay = (time) => new Promise(resolve => setTimeout(() => resolve(), time))
  await findVaccine("303") // Thrissur
  await delay(1000)
  await findVaccine("307") // Ernakulam
})()
