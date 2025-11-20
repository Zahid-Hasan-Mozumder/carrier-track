// To create a new webhook, create a new `.js` folder in /utils/webhooks/ and use the project snippet
// `createwebhook` to generate webhook boilerplate

/**
 * @typedef { import("@/_developer/types/2025-04/webhooks.js").FULFILLMENTS_CREATE} FulfillmentsCreate
 */

import prisma from "../prisma.js";
import matchShopifyCarrier from "../common/lib/match-shopify-carrier.js";
import { ShopifyFulfillmentStatus } from "../common/enums/shopify-fulfillment-status.js";

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
    const shopifyDefinedCarrier = webhookBody.tracking_company;
    const trackingCompany = matchShopifyCarrier(shopifyDefinedCarrier);
    const status = ShopifyFulfillmentStatus.CONFIRMED;
    await prisma.$transaction(async (tx) => {
      const store = await prisma.stores.findFirst({
        where: { shop: shop },
      });
      const carrier = await tx.carriers.upsert({
        where: { carrierName: trackingCompany },
        update: {},
        create: { carrierName: trackingCompany },
      });
      const fulfillment = await tx.fulfillments.create({
        data: {
          fulfillmentId: String(webhookBody.id),
          orderId: String(webhookBody.order_id),
          trackingNumber: webhookBody.tracking_number,
          trackingUrl: webhookBody.tracking_url,
          status: status,
          carrierId: carrier.id,
          storeId: store.id,
        },
      });
      await Promise.all(
        webhookBody.line_items.map(async (lineItem) => {
          return tx.fulfillmentLineItems.create({
            data: {
              productId: String(lineItem.product_id),
              title: lineItem.title,
              variantId: String(lineItem.variant_id),
              variantTitle: lineItem.variant_title ?? undefined,
              sku: lineItem.sku ?? undefined,
              quantity: lineItem.quantity,
              grams: lineItem.grams,
              price: lineItem.price,
              totalDiscount: lineItem.total_discount,
              fulfillmentId: fulfillment.id,
            },
          });
        })
      );
    });
  } catch (e) {
    console.error(e);
  }
};
export default fulfillmentsCreateHandler;
