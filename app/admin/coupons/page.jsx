"use client";

import { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react";
import { Plus, Ticket, Edit, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp, collection, getDocs, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function CouponsPage() {
  const [showForm, setShowForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minOrderValue: "",
    usageLimit: "",
    expiryDate: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const couponsSnapshot = await getDocs(collection(db, 'coupons'));
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }

    setLoading(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        expiryDate: formData.expiryDate ? Timestamp.fromDate(new Date(formData.expiryDate)) : null,
        isActive: true,
        usedCount: 0,
        timestampCreate: Timestamp.now()
      };

      console.log('Creating coupon:', couponData);
      await setDoc(doc(db, `coupons/${couponData.code}`), couponData);
      console.log('Coupon created successfully');
      
      toast.success("Coupon created successfully!");
      setShowForm(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: "",
        minOrderValue: "",
        usageLimit: "",
        expiryDate: ""
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(`Failed to create coupon: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
      toast.success('Coupon deleted successfully!');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Ticket className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Coupons</h1>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(!showForm)}
        >
          Create Coupon
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Coupon Code"
              placeholder="SAVE20"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              required
            />
            
            <Select
              label="Discount Type"
              selectedKeys={[formData.discountType]}
              onSelectionChange={(keys) => setFormData({...formData, discountType: Array.from(keys)[0]})}
            >
              <SelectItem key="percentage" value="percentage">Percentage (%)</SelectItem>
              <SelectItem key="fixed" value="fixed">Fixed Amount (₹)</SelectItem>
            </Select>

            <Input
              label={`Discount Value ${formData.discountType === 'percentage' ? '(%)' : '(₹)'}`}
              type="number"
              placeholder={formData.discountType === 'percentage' ? '20' : '100'}
              value={formData.discountValue}
              onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
              required
            />

            {formData.discountType === 'percentage' && (
              <Input
                label="Max Discount (₹)"
                type="number"
                placeholder="500"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
              />
            )}

            <Input
              label="Min Order Value (₹)"
              type="number"
              placeholder="200"
              value={formData.minOrderValue}
              onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
            />

            <Input
              label="Usage Limit"
              type="number"
              placeholder="100"
              value={formData.usageLimit}
              onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
            />

            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            />

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" color="primary" isLoading={loading}>
                Create Coupon
              </Button>
              <Button variant="bordered" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <Table aria-label="Coupons table">
          <TableHeader>
            <TableColumn>CODE</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>DISCOUNT</TableColumn>
            <TableColumn>MIN ORDER</TableColumn>
            <TableColumn>USAGE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={loadingCoupons ? "Loading..." : "No coupons found"}>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {coupon.discountType === 'percentage' ? '%' : '₹'}
                  </Chip>
                </TableCell>
                <TableCell>
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`}
                  {coupon.maxDiscount && ` (max ₹${coupon.maxDiscount})`}
                </TableCell>
                <TableCell>{coupon.minOrderValue ? `₹${coupon.minOrderValue}` : '-'}</TableCell>
                <TableCell>
                  {coupon.usedCount || 0}
                  {coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                </TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    color={coupon.isActive ? "success" : "danger"}
                    variant="flat"
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="light" 
                      color="danger"
                      startContent={<Trash2 className="h-4 w-4" />}
                      onClick={() => deleteCoupon(coupon.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}