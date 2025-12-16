"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/firestore/checkout/write";
import { useUserAddresses } from "@/lib/firestore/addresses/read";
import { saveUserAddress, deleteUserAddress } from "@/lib/firestore/addresses/write";
import { Button } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { CheckSquare2Icon, CreditCard, Book, Smartphone, Plus, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout({ productList, hasEbooks, hasPhysical }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { data: savedAddresses } = useUserAddresses({ uid: user?.uid });

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (selectedAddress?.pincode && hasPhysical) {
      console.log('Auto-fetching rates for selected address pincode:', selectedAddress.pincode);
      fetchShippingRates(selectedAddress.pincode.toString());
    }
  }, [selectedAddress, hasPhysical]);

  const fetchCityState = async (pincode) => {
    try {
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();
      
      if (data.success) {
        setNewAddress(prev => ({
          ...prev,
          city: data.city,
          state: data.state
        }));
      }
    } catch (error) {
      console.error('Failed to fetch city/state:', error);
    }
  };

  const getSelectedAddressData = () => {
    if (hasPhysical) {
      return selectedAddress || {
        fullName: user?.displayName || '',
        email: user?.email || '',
        mobile: '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: ''
      };
    }
    return {
      fullName: user?.displayName || '',
      email: user?.email || ''
    };
  };

  const fetchShippingRates = async (deliveryPincode) => {
    if (!deliveryPincode) return;
    
    setLoadingRates(true);
    setShippingRates([]);
    setSelectedShipping(null);
    
    try {
      const pincode = deliveryPincode.toString().trim();
      console.log('Fetching shipping rates for pincode:', pincode);
      
      const totalWeight = productList?.reduce((total, item) => {
        return total + (item?.quantity * 0.5); // Assuming 0.5kg per book
      }, 0);

      const response = await fetch('/api/shiprocket/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_postcode: '452008',
          delivery_postcode: pincode,
          weight: totalWeight,
          cod: true
        })
      });

      const data = await response.json();
      console.log('Shipping rates response:', data);
      
      if (data.success && data.rates?.length > 0) {
        setShippingRates(data.rates);
        setSelectedShipping(data.rates[0]); // Select first option by default
      } else {
        setShippingRates([]);
      }
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
      setShippingRates([]);
    } finally {
      setLoadingRates(false);
    }
  };

  // Calculate total price based on format
  const subtotal = productList?.reduce((prev, curr) => {
    const price = curr?.format === "ebook" 
      ? (curr?.product?.ebookSalePrice || curr?.product?.salePrice)
      : curr?.product?.salePrice;
    return prev + curr?.quantity * price;
  }, 0);

  const shippingCharge = hasPhysical && selectedShipping ? (subtotal >= 500 ? 0 : selectedShipping.rate) : 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const totalPrice = subtotal + shippingCharge - couponDiscount;

  const handleRazorpayPayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder({
        uid: user?.uid,
        products: productList,
        address: getSelectedAddressData(),
        totalAmount: totalPrice,
        coupon: appliedCoupon,
        shippingCharge: shippingCharge
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: orderData.currency,
        name: "Score 100 Books",
        description: "Purchase from Score 100 Books",
        image: "/logo.png",
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const result = await verifyRazorpayPayment({
              uid: user?.uid,
              checkoutId: orderData.checkoutId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              confetti();
              toast.success("Payment Successful!");
              router.push(`/checkout-success?checkout_id=${orderData.checkoutId}&uid=${user?.uid}`);
            }
          } catch (error) {
            toast.error(error?.message || "Payment verification failed");
            router.push(`/checkout-failed?checkout_id=${orderData.checkoutId}`);
          }
        },
        prefill: {
          name: getSelectedAddressData()?.fullName || user?.displayName || "",
          email: user?.email || "",
          contact: getSelectedAddressData()?.mobile || "",
        },
        notes: {
          address: hasPhysical ? `${selectedAddress?.addressLine1}, ${selectedAddress?.city}, ${selectedAddress?.state} - ${selectedAddress?.pincode}` : 'eBook Order',
        },
        theme: {
          color: "#312e81", // indigo-900
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error) {
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) {
        throw new Error("Price should be greater than 0");
      }
      
      // Validate address for physical products
      if (hasPhysical && !selectedAddress) {
        throw new Error("Please select a delivery address");
      }
      
      // Validate shipping option for physical products (only if subtotal < 500)
      if (hasPhysical && subtotal < 500 && !selectedShipping) {
        throw new Error("Please select a delivery option");
      }

      if (!productList || productList?.length === 0) {
        throw new Error("Product List Is Empty");
      }

      await handleRazorpayPayment();
    } catch (error) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedCoupon(data.coupon);
        toast.success(`Coupon applied! ₹${data.coupon.discount} discount`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  return (
    <section className="flex flex-col md:flex-row gap-3">
      {/* Address Section */}
      <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {hasPhysical ? "Delivery Address" : "Contact Info"}
          </h1>
          {hasPhysical && (
            <Button
              size="sm"
              variant="bordered"
              startContent={<Plus size={16} />}
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              Add Address
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{user?.displayName || 'User'}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{user?.email}</span>
          </div>
        </div>

        {hasPhysical ? (
          <div className="space-y-3">
            {/* Saved Addresses */}
            {savedAddresses?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Saved Addresses</h3>
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => {
                          setSelectedAddress(addr);
                          if (addr.pincode) {
                            console.log('Fetching rates for pincode:', addr.pincode);
                            fetchShippingRates(addr.pincode.toString());
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{addr.fullName}</div>
                        <div className="text-sm text-gray-600">
                          {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                        <div className="text-sm text-gray-500">{addr.mobile}</div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="bordered"
                        onClick={() => {
                          setEditingAddress(addr);
                          setNewAddress(addr);
                          setShowAddressForm(true);
                        }}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50 px-4 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="bordered"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this address?')) {
                            try {
                              await deleteUserAddress({ uid: user?.uid, addressId: addr.id });
                              if (selectedAddress?.id === addr.id) {
                                setSelectedAddress(null);
                              }
                              toast.success('Address deleted!');
                            } catch (error) {
                              toast.error('Failed to delete address');
                            }
                          }
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50 px-4 py-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {showAddressForm && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-3">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress?.fullName ?? ""}
                    onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                    className="border px-3 py-2 rounded-lg focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number (10 digits)"
                    value={newAddress?.mobile ?? ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setNewAddress({...newAddress, mobile: value});
                    }}
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    className="border px-3 py-2 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={newAddress?.addressLine1 ?? ""}
                    onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                    className="border px-3 py-2 rounded-lg focus:outline-none md:col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Pincode"
                    value={newAddress?.pincode ?? ""}
                    onChange={(e) => {
                      setNewAddress({...newAddress, pincode: e.target.value});
                      if (e.target.value.length === 6) fetchCityState(e.target.value);
                    }}
                    className="border px-3 py-2 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress?.city ?? ""}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="border px-3 py-2 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress?.state ?? ""}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="border px-3 py-2 rounded-lg focus:outline-none md:col-span-2"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!newAddress?.fullName || !newAddress?.mobile || !newAddress?.addressLine1) {
                        toast.error('Please fill all required fields');
                        return;
                      }
                      if (!/^[6-9][0-9]{9}$/.test(newAddress.mobile)) {
                        toast.error('Please enter a valid 10-digit mobile number starting with 6-9');
                        return;
                      }
                      try {
                        const addressWithEmail = { ...newAddress, email: user?.email };
                        const addressId = editingAddress ? editingAddress.id : null;
                        await saveUserAddress({ uid: user?.uid, address: addressWithEmail, addressId });
                        setSelectedAddress({ ...addressWithEmail, id: addressId || addressWithEmail.id });
                        setShowAddressForm(false);
                        setNewAddress(null);
                        setEditingAddress(null);
                        toast.success(editingAddress ? 'Address updated!' : 'Address saved!');
                      } catch (error) {
                        toast.error('Failed to save address');
                      }
                    }}
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    onClick={() => {
                      setShowAddressForm(false);
                      setNewAddress(null);
                      setEditingAddress(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Delivery Options */}
            {hasPhysical && selectedAddress?.pincode && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-medium mb-3 text-blue-900">Delivery Options</h3>
                {subtotal >= 500 ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="font-medium text-green-700">FREE Delivery</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">Your order qualifies for free delivery!</div>
                  </div>
                ) : loadingRates ? (
                  <div className="text-sm text-blue-600">Calculating delivery charges...</div>
                ) : shippingRates.length > 0 ? (
                  <div className="space-y-2">
                    {shippingRates.map((rate, index) => (
                      <label key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg cursor-pointer hover:border-blue-300">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.courier_company_id === rate.courier_company_id}
                            onChange={() => setSelectedShipping(rate)}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{rate.courier_name}</div>
                            <div className="text-sm text-gray-500">{rate.estimated_delivery_days} days delivery</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">₹{rate.rate}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">Delivery not available to this pincode</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Your eBook download link will be sent to {user?.email} after payment.
          </div>
        )}
      </section>
      <div className="flex-1 flex flex-col gap-3">
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <h2 className="text-xl">Products</h2>
          <div className="flex flex-col gap-2">
            {productList?.map((item, index) => {
              const isEbook = item?.format === "ebook";
              const price = isEbook 
                ? (item?.product?.ebookSalePrice || item?.product?.salePrice)
                : item?.product?.salePrice;
              return (
                <div key={index} className="flex gap-3 items-center p-2 rounded-lg bg-gray-50">
                  <div className="relative">
                    <img
                      className="w-12 h-12 object-cover rounded-lg"
                      src={item?.product?.featureImageURL}
                      alt=""
                    />
                    {isEbook ? (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                        <Smartphone size={10} className="text-white" />
                      </div>
                    ) : (
                      <div className="absolute -top-1 -right-1 bg-indigo-500 rounded-full p-0.5">
                        <Book size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-sm font-medium">{item?.product?.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isEbook 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {isEbook ? "eBook (PDF)" : "Hard Copy"}
                      </span>
                      <span className="text-green-600 font-semibold text-xs">
                        ₹{price} × {item?.quantity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">
                      ₹{price * item?.quantity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between items-center p-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {hasPhysical && selectedShipping && (
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Delivery ({selectedShipping.courier_name})</span>
                <span className={`font-medium ${subtotal >= 500 ? 'text-green-600' : 'text-gray-900'}`}>
                  {subtotal >= 500 ? 'FREE' : `₹${selectedShipping.rate}`}
                </span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Coupon ({appliedCoupon.code})</span>
                <span className="font-medium text-green-600">-₹{appliedCoupon.discount}</span>
              </div>
            )}
            {hasPhysical && !selectedShipping && selectedAddress && (
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-400">Select option</span>
              </div>
            )}
            <div className="flex justify-between w-full items-center p-2 font-bold border-t border-gray-300 bg-gray-50 rounded">
              <span className="text-lg">Total Amount</span>
              <span className="text-xl text-green-600">₹{totalPrice}</span>
            </div>
            
            {/* Coupon Section */}
            <div className="border-t pt-2">
              <div className="flex gap-2 items-center p-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 border px-3 py-2 rounded-lg focus:outline-none text-sm"
                  disabled={appliedCoupon}
                />
                {appliedCoupon ? (
                  <Button size="sm" variant="bordered" onClick={removeCoupon}>
                    Remove
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={applyCoupon}
                    isLoading={couponLoading}
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-indigo-900">Payment</h2>
            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500 text-white">
                <CreditCard size={18} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-indigo-900">Pay Online</p>
                <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
              </div>
              <CheckSquare2Icon className="ml-auto text-indigo-500" size={20} />
            </div>
            
            {/* Payment Methods Icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">UPI</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Google Pay</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">PhonePe</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Paytm</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Cards</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Net Banking</span>
              </div>
            </div>

            {hasEbooks && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
                <strong> eBook:</strong> Download link will be sent to your email instantly after payment.
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center mt-2">
            <CheckSquare2Icon className="text-indigo-500" size={16} />
            <span className="text-sm text-gray-600">
              I agree with the{" "}
              <span className="text-indigo-600 hover:underline cursor-pointer">terms & conditions</span>
            </span>
          </div>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handlePlaceOrder}
            className="bg-indigo-900 text-white font-semibold py-6 rounded-full shadow-lg hover:translate-y-[-1px] transition-transform"
          >
            Pay Now • ₹{totalPrice}
          </Button>
        </section>
      </div>
    </section>
  );
}
