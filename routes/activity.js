const { v1: Uuidv1 } = require('uuid');

const JWT = require('../utils/jwtDecoder');

const SFClient = require('../utils/sfmc-client');

const logger = require('../utils/logger');

var request = require('request');

var resStatus;

/**

 * The Journey Builder calls this method for each contact processed by the journey.

 * @param req

 * @param res

 * @returns {Promise<void>}

 */

exports.execute = async (req, res) => {

  // decode data

  const data = JWT(req.body);

 

  logger.info(data);

 

  try {

    const id = Uuidv1();

    /* added later for zerobounce api start*/

    var options = {

      'method': 'GET',

      'url': 'https://api.zerobounce.net/v2/validate?api_key=f374fdb676984508b046e68843e35592&email='+data.inArguments[0].contactKey+'&ip_address=',

      'headers': {

      }

      };

     

      request(options, await function (error, response) {

      if (error) throw new Error(error);

      console.log(response.body);  

      const resObj = JSON.parse(response.body);

      //resArr.push(resObj.status);

      resStatus = resObj.status;

      });

      /* added later for zerobounce api end*/

 

      const timeoutObj = setTimeout(async() => {

        await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [

          {

            keys: {

              Id: id,

              SubscriberKey: data.inArguments[0].contactKey,

            },

            values: {

              Event: data.inArguments[0].DropdownOptions,

              Text: data.inArguments[0].Text,

              Status: resStatus,

            },

          },

        ]);

       

      }, 1000);

 

    // await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [

    //   {

    //     keys: {

    //       Id: id,

    //       SubscriberKey: data.inArguments[0].contactKey,

    //     },

    //     values: {

    //       Event: data.inArguments[0].DropdownOptions,

    //       Text: data.inArguments[0].Text,

    //       Status: resStatus,

    //     },

    //   },

    // ]);

  } catch (error) {

    logger.error(error);

  }

 

  const timeoutObj2 = setTimeout(() => {

    res.status(200).send({

      status: 'ok',

    });  

    }, 1100);

 

};

 

/**

 * Endpoint that receives a notification when a user saves the journey.

 * @param req

 * @param res

 * @returns {Promise<void>}

 */

exports.save = async (req, res) => {

  res.status(200).send({

    status: 'ok',

  });

};

 

/**

 *  Endpoint that receives a notification when a user publishes the journey.

 * @param req

 * @param res

 */

exports.publish = (req, res) => {

  res.status(200).send({

    status: 'ok',

  });

};

 

/**

 * Endpoint that receives a notification when a user performs

 * some validation as part of the publishing process.

 * @param req

 * @param res

 */

exports.validate = (req, res) => {

  res.status(200).send({

    status: 'ok',

  });

};
