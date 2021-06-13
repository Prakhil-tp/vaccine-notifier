const rp = require("request-promise");
const moment = require("moment");
const { exec } = require("child_process");

const date = moment().format("DD-MM-YYYY");
const reqOptions = {
  url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=303&date=${date}`,
  headers: {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    authorization: "Bearer ",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "sec-gpc": "1"
  },
  referrer: "https://selfregistration.cowin.gov.in/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
  mode: "cors"
};

(async () => {
  const dataStr = await rp(reqOptions);
  const { centers } = JSON.parse(dataStr);

  const availability = centers.filter((center) => {
    return center.sessions.some((session) => session.available_capacity > 0);
  });

  if (availability.length > 0) {
    let message = `
    VACCINE AVAILABILE
  `;
    message += availability.reduce((acc, value) => {
      let covaxin = "";
      let covishield = "";

      if (value.sessions.some((session) => session.vaccine === "COVAXIN")) {
        covaxin = "COVAXIN";
      } else if (
        value.sessions.some((session) => session.vaccine === "COVISHIELD")
      ) {
        covishield = "COVISHIELD";
      }
      value = `
    center name: ${value.name} 
    address: ${value.address}
    block name: ${value.block_name}
    pincode: ${value.block_name}
    fee type: ${value.fee_type}
    vaccine: ${covishield ? covishield + "," : ""} ${covaxin}
    `;
      return acc + value;
    }, "");

    exec(`./script.sh "${message}"`, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (err !== null) {
        console.log(`exec error: ${err}`);
      }
    });
  }
})();
