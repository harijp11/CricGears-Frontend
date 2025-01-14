import React from "react";
import PropTypes from "prop-types";

function AdditionalProductInfo({ product }) {
  return (
    <div className='bg-white py-8 px-4 sm:px-6 lg:px-8'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Additional Information
        </h2>

        <div className='space-y-6'>
          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Description
            </h3>
            <p className='text-gray-600'>{product.description}</p>
          </div>

         

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Category</h3>
            <p className='text-gray-600'>{product.category.name}</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Sizes & Stock
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {product.sizes.map((size) => (
                <div
                  key={size._id}
                  className='bg-gray-100 p-2 rounded text-center'>
                  <span className='font-medium'>{size.size}: </span>
                  <span className='text-gray-600'>
                    {size.stock > 0 ? `${size.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Total Stock
            </h3>
            <p className='text-gray-600'>{product.totalStock} items</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Price</h3>
            <p className='text-gray-600'>
              Original: INR{product.price.toFixed(2)}
              {product.salePrice && product.salePrice < product.price && (
                <span className='ml-2 text-red-600'>
                  Sale: INR{product.salePrice.toFixed(2)}
                </span>
              )}
            </p>
          </div>

       
        </div>
      </div>
    </div>
  );
}
AdditionalProductInfo.propTypes = {
  product: PropTypes.object.isRequired, // Array of objects

};
export default React.memo(AdditionalProductInfo);
