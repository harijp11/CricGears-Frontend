import { findProductAndCategoryOfferApi } from "../APIs/OffersApi";

export async function CalculateOfferPrice({
  product_id,
  category_id,
  product_price,
  product_saleprice
}){
  try {
      const response = await findProductAndCategoryOfferApi(
          product_id,
          category_id,
          product_price,
      );

      if (!response || !response.data) {
          throw new Error('Invalid API response');
      }

      console.log("API Response:", response.data);
      
      const productOfferPercentage = response.data.productoffer || 0;
      const categoryOfferPercentage = response.data.categoryoffer || 0; // Fixed .date to .data
      
      const productDiscountAmount = (product_price * productOfferPercentage) / 100;
      const categoryDiscountAmount = (product_price * categoryOfferPercentage) / 100;

      const offerData = {
          offerPrice: product_saleprice,
          offerDiscountAmt: null,
          offerDiscount: null,
      };

      if (categoryDiscountAmount > productDiscountAmount) {
          offerData.offerPrice = product_price - categoryDiscountAmount;
          offerData.offerDiscountAmt = categoryDiscountAmount;
          offerData.offerDiscount = categoryOfferPercentage;
      } else if (productDiscountAmount > categoryDiscountAmount) {
          offerData.offerPrice = product_price - productDiscountAmount;
          offerData.offerDiscountAmt = productDiscountAmount;
          offerData.offerDiscount = productOfferPercentage;
      }

      return offerData;
  } catch (err) {
      console.error("Error calculating offer:", err);
      // Return default values instead of undefined
      return {
          offerPrice: product_saleprice,
          offerDiscountAmt: null,
          offerDiscount: null
      };
  }
}