import { addCategoryOfferApi } from "../../../APIs/OffersApi";
import { validateOfferForm } from "../../../util/categoryOfferValidation";
import {ArrowLeft} from "lucide-react"
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AddCategoryOffer = () => {
  const { id, categoryName } = useParams();
  const [offerName, setofferName] = useState("");
  const [offerValue, setofferValue] = useState(0);
  const [offerExpairyDate, setOfferExpairyDate] = useState();
  const [error, setError] = useState({});
  const navigate = useNavigate();

  async function handleAddOffer() {
    const { errors, isValid } = validateOfferForm(
      offerName,
      offerValue,
      offerExpairyDate
    );

    if (!isValid) {
      setError(errors);
      return;
    }

    try {
      const target_type = "category";
      // console.log(
      //   "evrything",
      //   id,
      //   offerName,
      //   Number(offerValue),
      //   new Date(offerExpairyDate).toISOString(),
      //   target_type
      // );

      const response = await addCategoryOfferApi(
        id,
        offerName,
        Number(offerValue),
        new Date(offerExpairyDate).toISOString(),
        target_type,
        categoryName
      );
      toast.success(response.data.message);
      navigate("/admin/viewcategory");
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
       <div class="fixed left-3 top-3">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 top-0 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          </div>
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="bg-gray-900 px-6 py-4">
            <h2 className="text-center text-3xl font-extrabold text-white">
              Add Offer for Category
            </h2>
          </div>
          <div className="px-6 py-8">
            <p className="text-center text-lg text-gray-600 mb-8">
              Target Name:
              <span className="font-semibold">{categoryName}</span>
            </p>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Offer Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={offerName}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter offer name"
                    onChange={(e) => {
                      setofferName(e.target.value.toUpperCase());
                    }}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.offerName}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="offer_value"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Offer Value
                  </label>
                  <input
                    id="offer_value"
                    name="offer_value"
                    type="number"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    placeholder="Enter offer value"
                    onChange={(e) => {
                      setofferValue(e.target.value);
                    }}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.offerValue}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    onChange={(e) => {
                      setOfferExpairyDate(e.target.value);
                    }}
                  />
                  <span className="text-red-700   mt-10 ms-2">
                    {error && error.offerExpairyDate}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleAddOffer}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out"
                >
                  Add Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryOffer;
