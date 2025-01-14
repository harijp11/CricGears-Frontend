import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

function ReturnConfirmation({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const handleConfirm = () => {
    onConfirm(reason, explanation); // Call the onConfirm handler
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="backdrop-blur-md bg-black/50"
    >
      <ModalContent className="bg-white drop-shadow-2xl rounded-xl p-6 border border-gray-200">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 bg-white text-center">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700 text-lg font-medium mb-4">
                {message}
              </p>
              <div className="flex flex-col gap-6">
                {/* Dropdown for Reason */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-600 font-medium">
                    Reason for Return
                  </label>
                  <select
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a reason</option>
                    <option value="size_issue">Size Issue</option>
                    <option value="color_mismatch">Qaulity is not expected bad</option>
                    <option value="defective_product">Defective Product</option>
                    <option value="wrong_item">Wrong Item Delivered</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Explanation Textarea */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-600 font-medium">
                    Explanation
                  </label>
                  <textarea
                    placeholder="Provide more details (optional)"
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-4">
              <Button
                color="danger"
                variant="light"
                className="text-red-600 font-semibold px-6 py-2 rounded-full hover:bg-red-50"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                color="primary"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700"
                onPress={handleConfirm}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ReturnConfirmation;
