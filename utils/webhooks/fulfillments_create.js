// To create a new webhook, create a new `.js` folder in /utils/webhooks/ and use the project snippet
// `createwebhook` to generate webhook boilerplate

/**
 * @typedef { import("@/_developer/types/2025-04/webhooks.js").FULFILLMENTS_CREATE} FulfillmentsCreate
 */

import prisma from "../prisma.js";

const fulfillmentsCreateHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  try {
    /** @type {FulfillmentsCreate} */
    const webhookBody = JSON.parse(webhookRequestBody);
    
    console.log("webhookBody", webhookBody);

  } catch (e) {
    console.error(e);
  }
};

export default fulfillmentsCreateHandler;
