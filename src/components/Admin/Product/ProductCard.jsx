import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import { removeOffer } from "../../../services/OffersApi";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { TableCell, TableRow } from "../../ui/table";
import { Edit, PlusCircle, Trash } from "lucide-react";
import EditProductPop from "./EditProduct";
import { toggleProductStatus } from "../../../services/productsService";

function ProductCard({setProducts, product, categories, setReload, offers }) {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [displayOffer, setDisplayOffer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const productOffer = offers.find((offer) => offer.targetId === product._id);

    const categoryOffer = product.catOfferval
      ? {
          offerValue: product.catOfferval,
          offerType: "category",
        }
      : null;

    setCurrentOffer(productOffer || null);

    if (productOffer && categoryOffer) {
      setDisplayOffer(
        productOffer.offerValue >= categoryOffer.offerValue
          ? { ...productOffer, offerType: "product" }
          : categoryOffer
      );
    } else {
      setDisplayOffer(
        productOffer
          ? { ...productOffer, offerType: "product" }
          : categoryOffer
          ? categoryOffer
          : null
      ); 
    }
  }, [
    product._id, product.catOfferval, offers
  ]);

  async function handleToggle(_id, isActive) {
    try {
      const response = await toggleProductStatus(_id, isActive);
      if(response.data.success){
        setProducts((prev)=>
         prev.map((pro) =>
          pro._id === _id ? { ...pro, isActive: !pro.isActive } : pro
        )
        )
      }
      toast.success(response.data.message);
      setReload(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return toast.error(err.response.data.message);
      }
      console.log(err);
      toast.error("An error occurred. Please try again.");
    }
  }

  async function handleRemoveOffer(_id, categoryid) {
    try {
      const response = await removeOffer(_id, categoryid);
      toast.success(response.data.message);
      setCurrentOffer(null);
      setReload(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            {displayOffer && (
              <div
                className={`absolute top-0 right-0 px-2 py-1 rounded-bl text-xs font-semibold ${
                  displayOffer.offerType === "category"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {displayOffer.offerValue}% OFF
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-500">{product.category.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>Rs.{product.salePrice.toFixed(2)}</TableCell>
      <TableCell>
        <p className="line-clamp-2 text-sm">{product.description}</p>
      </TableCell>
      <TableCell>
        {currentOffer ? (
          <div className="flex items-center space-x-2">
            {/* <span className="text-sm font-medium text-green-600">
              {currentOffer.offerValue}% off
            </span> */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                handleRemoveOffer(currentOffer._id, product.category)
              }
            >
              <Trash className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/admin/addproductoffer/${product._id}/${product.name}`)
            }
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Offer
          </Button>
        )}
      </TableCell>
      <TableCell>
        {product.isActive ? (
          <div className="bg-green-100 text-green-600 rounded-md px-2 py-1 max-w-[80px] text-center">
            <h1 className="text-sm">Active</h1>
          </div>
        ) : (
          <div className="bg-red-100 text-red-600 rounded-md px-2 py-1 max-w-[80px] text-center">
            <h1 className="text-sm">Blocked</h1>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <EditProductPop
            product={product}
            categories={categories}
            setReload={setReload}
          />
          <Switch
            checked={product.isActive}
            onCheckedChange={() => handleToggle(product._id, !product.isActive)}
            className="data-[state=checked]:bg-indigo-600"
          />
          <span className="text-sm font-medium">
            {product.isActive ?  "Unlist" : "list" }
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default React.memo(ProductCard);
