import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Eye, Edit, Tag, Trash2, SquareMinus, Minus, X, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../../AxiosInstance";
import { toast, Toaster } from "sonner";
import { validateEditProduct } from "../../../util/EditProductvalidation";
import { editProduct, fetchProductById } from "../../../services/productsService";
import { getAdminCategories } from "../../../services/categoryService";

function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [sizes, setSizes] = useState([]);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSalePrice, setEditSalePrice] = useState("");
  const [editSizes, setEditSizes] = useState([]);
  const [editImages, setEditImages] = useState([]);

  const [images, setImages] = useState([]);
  const [cropperInstances, setCropperInstances] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [error, setError] = useState({});

  const [cropperDimensions, setCropperDimensions] = useState({
    width: 300,
    height: 400,
  });

  // Fetch product data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await fetchProductById(productId);
        const productData = productResponse.data.product;
        setProduct(productData);
        
        // Set form fields with product data
        setEditName(productData.name);
        setEditDescription(productData.description);
        setEditCategory(productData.category);
        setEditPrice(productData.price);
        setEditSalePrice(productData.salePrice);
        setSizes(productData.sizes || []);
        setEditSizes(productData.sizes);
        setEditImages(productData.images);
        
        // Fetch categories
        const categoriesResponse = await getAdminCategories();
        setCategories(categoriesResponse.data.categories);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product data");
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = fileURL;
        return newImages;
      });
      setCroppedImages((prev) => {
        const newCroppedImages = [...prev];
        newCroppedImages[index] = null;
        return newCroppedImages;
      });
    }
  };

  const onCropComplete = useCallback(
    (index) => () => {
      if (cropperInstances[index]) {
        const croppedImageData = cropperInstances[index]
          .getCroppedCanvas()
          .toDataURL();
        // You can store this data if needed, or just use it when the user clicks "done"
      }
    },
    [cropperInstances]
  );

  const handleCropped = async (index) => {
    if (cropperInstances[index]) {
      const croppedImageBlob = await new Promise((resolve) => {
        cropperInstances[index].getCroppedCanvas().toBlob(resolve);
      });
      const croppedImageURL = URL.createObjectURL(croppedImageBlob);
      setCroppedImages((prev) => {
        const newCroppedImages = [...prev];
        newCroppedImages[index] = croppedImageURL;
        return newCroppedImages;
      });
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = null;
        return newImages;
      });
    }
  };

  const handleCropMove = useCallback(() => {
    const newWidth = Math.floor(Math.random() * (400 - 200 + 1)) + 200; // Random width between 200 and 400
    const newHeight = Math.floor(Math.random() * (500 - 300 + 1)) + 300; // Random height between 300 and 500
    setCropperDimensions({ width: newWidth, height: newHeight });
  }, []);

  async function handleEdit() {
    const validationErrors = validateEditProduct({
      editName,
      editDescription,
      editPrice,
      editSalePrice,
      editCategory,
      editSizes,
      croppedImages,
      editImages,
    });

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const convertBlobUrlFile = async (blobUrl) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const file = new File(
          [blob],
          `image_${new Date().toLocaleString().replace(/[/: ]/g, "_")}.png`,
          { type: blob.type }
        );
        return file;
      };

      const files = [];
      for (const blobUrl of croppedImages) {
        if (!blobUrl) {
          files.push(blobUrl);
        } else {
          const file = await convertBlobUrlFile(blobUrl);
          files.push(file);
        }
      }

      const uploadedImageUrls = [];
      for (const file of files) {
        if (!file) {
          uploadedImageUrls.push(file);
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "CricGears");

          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dyxss1qle/image/upload/",
            formData
          );

          uploadedImageUrls.push(res.data.secure_url);
        }
      }

      const imageEdit = [];

      Array.from({ length: 5 }).map((_, index) => {
        if (uploadedImageUrls[index]) {
          imageEdit.push(uploadedImageUrls[index]);
        } else if (editImages[index]) {
          imageEdit.push(editImages[index]);
        }
      });

      if (imageEdit.length < 3) {
        return setError((prevErr) => ({
          ...prevErr,
          images: "Minimum 3 images required",
        }));
      }

      const response = await editProduct({
        _id: product._id,
        name: editName,
        description: editDescription,
        price: editPrice,
        salePrice: editSalePrice,
        category: editCategory,
        sizes: editSizes,
        images: imageEdit,
      });

      toast.success(response.data.message);
      navigate("/admin/viewproducts");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
      console.log(err);
    }
  }

  function handleRemoveImage(deleteImage) {
    toast.success("Image removed");
    const updatedEditImages = editImages.filter(
      (image) => image !== deleteImage
    );

    const updatedCroppedImages = croppedImages.filter(
      (image) => image !== deleteImage
    );

    setEditImages(updatedEditImages);
    setCroppedImages(updatedCroppedImages);
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <p className="text-gray-600">Product not found</p>
            <Button onClick={() => navigate("/admin/viewproducts")} className="mt-4">
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/viewproducts")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-6">
        <button className="text-gray-500" onClick={() => navigate("/admin/home")}>
          Home &gt;
        </button>
        <button className="text-gray-500" onClick={() => navigate("/admin/Dashboard")}>
          Dashboard &gt;
        </button>
        <button className="text-gray-500" onClick={() => navigate("/admin/viewproducts")}>
          View Products &gt;
        </button>
        <span className="text-gray-500">Edit Product</span>
      </div>

      {/* Cropper Modal */}
      {images.map(
        (image, index) =>
          image && (
            <div
              key={index}
              className="crop-container fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
                style={{
                  width: cropperDimensions.width,
                  height: cropperDimensions.height,
                }}
              >
                <Cropper
                  src={image}
                  style={{ height: "100%", width: "100%" }}
                  aspectRatio={2 / 3}
                  guides={true}
                  crop={onCropComplete(index)}
                  onInitialized={(instance) => {
                    setCropperInstances((prev) => {
                      const newInstances = [...prev];
                      newInstances[index] = instance;
                      return newInstances;
                    });
                  }}
                  cropMove={handleCropMove}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  responsive={true}
                  checkOrientation={false}
                  zoomable={true}
                  scalable={true}
                  movable={true}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      handleCropped(index);
                      toast.success("Image updated successfully");
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {/* Name input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                onChange={(e) => {
                  setEditName(e.target.value);
                  setError((prev) => ({ ...prev, editName: "" }));
                }}
                value={editName}
                className="col-span-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-red-700 mt-10 ms-2">
                {error && error.editName}
              </span>
            </div>

            {/* Price input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right font-medium text-gray-700">
                Price
              </Label>
              <Input
                id="price"
                onChange={(e) => {
                  setEditPrice(e.target.value);
                  setError((prev) => ({ ...prev, editPrice: "" }));
                }}
                value={editPrice}
                className="col-span-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-red-700 mt-10 ms-2">
                {error && error.editPrice}
              </span>
            </div>

            {/* Sale Price input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salePrice" className="text-right font-medium text-gray-700">
                Sale Price
              </Label>
              <Input
                id="salePrice"
                onChange={(e) => {
                  setEditSalePrice(e.target.value);
                  setError((prev) => ({ ...prev, editSalePrice: "" }));
                }}
                value={editSalePrice}
                className="col-span-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-red-700 mt-10 ms-2">
                {error && error.editSalePrice}
              </span>
            </div>

            {/* Description textarea */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2 font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={editDescription || ""}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                  setError((prev) => ({ ...prev, editDescription: "" }));
                }}
                className="col-span-3 h-32 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product description"
              />
              <span className="text-red-700 mt-10 ms-2">
                {error && error.editDescription}
              </span>
            </div>

            {/* Category select */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium text-gray-700">
                Category
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) => {
                    setEditCategory(value);
                  }}
                  value={editCategory}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className="text-red-700 mt-10 ms-2">
                    {error && error.editCategory}
                  </span>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={product.category.name} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((cat, index) => (
                      <SelectItem key={index} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            {/* Sizes and Stock */}
            <Label className="font-medium text-gray-700">
              Sizes and Stock
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {product.sizes.map((item, index) => (
                <div key={item.size} className="flex items-center space-x-2">
                  <span className="w-8 font-medium">
                    {item.size}
                  </span>
                  <Select
                    onValueChange={(value) => {
                      const updatedSizes = [...sizes];
                      updatedSizes[index].stock = parseInt(value);
                      setEditSizes(updatedSizes);
                    }}
                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={item.stock} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Array.from({ length: 30 }, (_, i) => i).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Product Images */}
            <Label className="font-medium text-gray-700">
              Product Images
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="border-2 h-56 w-36 aspect-square border-dashed border-gray-300 rounded-lg p-2 text-center flex items-center justify-center flex-col relative bg-white hover:border-blue-500 transition-colors"
                >
                  {croppedImages[index] || editImages[index] ? (
                    <>
                      <img
                        src={croppedImages[index] || editImages[index]}
                        alt={`Product Image ${index + 1}`}
                        className="rounded-lg h-full w-full object-cover"
                      />
                      <span
                        onClick={() =>
                          handleRemoveImage(
                            croppedImages[index] || editImages[index]
                          )
                        }
                        className="my-2 cursor-pointer text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Add Image
                    </span>
                  )}
                  <input
                    style={{ height: "80%" }}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer upload-area"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageUpload(e, index);
                      setError((prev) => ({ ...prev, editImages: "" }));
                    }}
                  />
                </div>
              ))}
              <span className="text-red-700 mt-10 ms-2">
                {error && error.editImages}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/viewproducts")}
            className="px-6 py-3"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;