import { useState } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { PackageX } from "lucide-react";
import { Card, CardContent } from "../ui/Caard";
const ProductCardContainer = ({ products }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* <h2 className="text-2xl font-bold mb-6">Similar Products</h2> */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-7">
          
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length == 0 && (
            <Card className="w-full max-w-md mx-auto">
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center p-6 text-center"
                >
                  <PackageX
                    className="w-12 h-12 mb-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-lg font-medium text-muted-foreground">
                    No products available in{" "}
                    {/* <span className="font-semibold text-foreground">
                      CricGears
                    </span> */}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

// Define PropTypes
ProductCardContainer.propTypes = {
  // title: PropTypes.string,
  products: PropTypes.array,
};

export default ProductCardContainer;
