import { db } from "@/lib/firebase";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

export const updateOrderStatus = async ({ id, status, shiprocketOrderId, shipmentId, awbCode, courierName }) => {
  const updateData = {
    status: status,
    timestampStatusUpdate: Timestamp.now(),
  };

  if (shiprocketOrderId) {
    updateData.shiprocketOrderId = shiprocketOrderId;
    updateData.shipmentId = shipmentId;
    updateData.awbCode = awbCode;
    updateData.courierName = courierName;
  }

  await updateDoc(doc(db, `orders/${id}`), updateData);
};

export const acceptOrderWithShiprocket = async ({ id, shiprocketOrderId, shiprocketShipmentId, packageDetails }) => {
  await updateDoc(doc(db, `orders/${id}`), {
    status: 'accepted',
    shiprocketOrderId,
    shiprocketShipmentId,
    packageDetails,
    timestampAccepted: Timestamp.now(),
  });
};
