import { AmazonShippingStatus } from "../enums/amazon-shipping-status.js";
import { ShopifyFulfillmentStatus } from "../enums/shopify-fulfillment-status.js";

const matchAmazonShopifyStatus = (amazonStatus) => {
  switch (amazonStatus) {
    case AmazonShippingStatus.PRE_TRANSIT:
      return ShopifyFulfillmentStatus.CONFIRMED;
    case AmazonShippingStatus.IN_TRANSIT:
      return ShopifyFulfillmentStatus.IN_TRANSIT;
    case AmazonShippingStatus.OUT_FOR_DELIVERY:
      return ShopifyFulfillmentStatus.OUT_FOR_DELIVERY;
    case AmazonShippingStatus.DELIVERED:
      return ShopifyFulfillmentStatus.DELIVERED;
    case AmazonShippingStatus.LOST:
      return ShopifyFulfillmentStatus.FAILURE;
    case AmazonShippingStatus.REJECTED:
      return ShopifyFulfillmentStatus.FAILURE;
    case AmazonShippingStatus.UNDELIVERABLE:
      return ShopifyFulfillmentStatus.FAILURE;
    case AmazonShippingStatus.DELIVERY_ATTEMPTED:
      return ShopifyFulfillmentStatus.ATTEMPTED_DELIVERY;
    case AmazonShippingStatus.PICKUP_CANCELLED:
      return ShopifyFulfillmentStatus.FAILURE;
    case AmazonShippingStatus.AWAITING_CUSTOMER_PICKUP:
      return ShopifyFulfillmentStatus.OUT_FOR_DELIVERY;
    default:
      return null;
  }
};

export default matchAmazonShopifyStatus;
