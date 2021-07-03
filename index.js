const rp = require("request-promise");
const moment = require("moment");
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
    const date = moment().format("DD-MM-YYYY");
    config.url += `?district_id=${districtID}&date=${date}`;
    console.log(config)
    const dataStr = await rp(config);
    const { centers } = JSON.parse(dataStr);
    const availableCenters = centers.filter((center) => {
      return center.sessions.some(
        (session) =>
          session.available_capacity_dose1 > 0 && session.min_age_limit === 18
      );
    }); // O(n*m)

    if (availableCenters.length > 0) {
      let message = "   VACCINE AVAILABLE";
      message += availableCenters.reduce((acc, value) => {
        let vaccine = [];
        let date = [];
        value.sessions.forEach((session) => {
          if (!vaccine.some(session.vaccine)) vaccine.push(session.vaccine);
          if (!date.some(session.date)) date.push(session.date);
        });
        return acc + makeMessage(value, vaccine.toString(), date.toString());
      }, ""); // O(p*m)
      sendMessage(message);
    }
  } catch(err) {
    console.log(err.message)
  }
}
// O(m*(p+n))

(async () => {
  await findVaccine("303") // Thrissur
  await findVaccine("307") // Ernakulam
})
