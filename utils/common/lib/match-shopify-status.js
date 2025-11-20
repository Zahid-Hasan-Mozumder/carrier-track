import { ShopifyFulfillmentStatus } from "../enums/shopify-fulfillment-status";

export const matchShopifyStatus = (shopifyStatus) => {
  switch (shopifyStatus) {
    case "IN_TRANSIT":
      return ShopifyFulfillmentStatus.IN_TRANSIT;
    default:
      return null;
  }
};
