"use client";

import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";
import { useCollections } from "@/lib/firestore/collections/read";
import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, FileText, X, Loader2 } from "lucide-react";

export default function BasicDetails({ data, handleData }) {
  const [isUploadingEbook, setIsUploadingEbook] = useState(false);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();
  return (
    <section className="flex-1 flex flex-col gap-3 bg-white rounded-xl p-4 border">
      <h1 className="font-semibold">Book Details</h1>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-title">
          Book Name <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="text"
          placeholder="Enter Title"
          id="product-title"
          name="product-title"
          value={data?.title ?? ""}
          onChange={(e) => {
            handleData("title", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-short-decription"
        >
          Short Description <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="text"
          placeholder="Enter Short Description"
          id="product-short-decription"
          name="product-short-decription"
          value={data?.shortDescription ?? ""}
          onChange={(e) => {
            handleData("shortDescription", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-brand">
          Board (CBSE/MPBSE) <span className="text-red-500">*</span>{" "}
        </label>
        <div className="flex flex-wrap gap-2 border px-4 py-3 rounded-lg w-full">
          {brands?.map((item) => {
            const isSelected = data?.brandIds?.includes(item?.id);
            return (
              <label
                key={item?.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer border transition-all ${
                  isSelected
                    ? "bg-violet-900 text-white border-violet-900"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const currentIds = data?.brandIds ?? [];
                    if (e.target.checked) {
                      handleData("brandIds", [...currentIds, item?.id]);
                    } else {
                      handleData(
                        "brandIds",
                        currentIds.filter((id) => id !== item?.id)
                      );
                    }
                  }}
                  className="hidden"
                />
                <span className="text-sm">{item?.name}</span>
              </label>
            );
          })}
        </div>
        {(!data?.brandIds || data?.brandIds?.length === 0) && (
          <p className="text-xs text-gray-400">Select at least one board</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-category">
          Class (9-12) <span className="text-red-500">*</span>{" "}
        </label>
        <select
          type="text"
          id="product-category"
          name="product-category"
          value={data?.categoryId ?? ""}
          onChange={(e) => {
            handleData("categoryId", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value="">Select Class</option>
          {categories?.map((item) => {
            return (
              <option value={item?.id} key={item?.id}>
                {item?.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-collection">
          Subject / Collection
        </label>
        <select
          id="product-collection"
          name="product-collection"
          value={data?.collectionId ?? ""}
          onChange={(e) => {
            handleData("collectionId", e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        >
          <option value="">Select Subject</option>
          {collections?.map((item) => {
            return (
              <option value={item?.id} key={item?.id}>
                {item?.title}
              </option>
            );
          })}
        </select>
        {(!collections || collections.length === 0) && (
          <p className="text-xs text-gray-400">No collections available. Create collections first in Admin → Collections.</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-stock">
          Stock <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Stock"
          id="product-stock"
          name="product-stock"
          value={data?.stock ?? ""}
          onChange={(e) => {
            handleData("stock", e.target.valueAsNumber);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-price">
          Price <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Price"
          id="product-price"
          name="product-price"
          value={data?.price ?? ""}
          onChange={(e) => {
            handleData("price", e.target.valueAsNumber);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-sale-price">
          Sale Price <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Sale Price"
          id="product-sale-price"
          name="product-sale-price"
          value={data?.salePrice ?? ""}
          onChange={(e) => {
            handleData("salePrice", e.target.valueAsNumber);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-is-featured-product"
        >
          Is Featured Product <span className="text-red-500">*</span>{" "}
        </label>
        <select
          type="number"
          placeholder="Enter Sale Price"
          id="product-is-featured-product"
          name="product-is-featured-product"
          value={data?.isFeatured ? "yes" : "no"}
          onChange={(e) => {
            handleData("isFeatured", e.target.value === "yes" ? true : false);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
          required
        >
          <option value={"no"}>No</option>
          <option value={"yes"}>Yes</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-is-coming-soon"
        >
          Coming Soon
        </label>
        <select
          id="product-is-coming-soon"
          name="product-is-coming-soon"
          value={data?.isComingSoon ? "yes" : "no"}
          onChange={(e) => {
            handleData("isComingSoon", e.target.value === "yes" ? true : false);
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        >
          <option value={"no"}>No</option>
          <option value={"yes"}>Yes</option>
        </select>
        <p className="text-xs text-gray-400">Enable if this product is not yet available for purchase</p>
      </div>

      {/* eBook Section */}
      <div className="border-t pt-4 mt-2">
        <h2 className="font-semibold text-sm mb-3 text-indigo-900"> eBook / Digital Version</h2>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs" htmlFor="product-has-ebook">
              Has eBook Version
            </label>
            <select
              id="product-has-ebook"
              name="product-has-ebook"
              value={data?.hasEbook ? "yes" : "no"}
              onChange={(e) => {
                handleData("hasEbook", e.target.value === "yes" ? true : false);
              }}
              className="border px-4 py-2 rounded-lg w-full outline-none"
            >
              <option value={"no"}>No</option>
              <option value={"yes"}>Yes</option>
            </select>
          </div>

          {data?.hasEbook && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="ebook-price">
                  eBook Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter eBook Price"
                  id="ebook-price"
                  name="ebook-price"
                  value={data?.ebookPrice ?? ""}
                  onChange={(e) => {
                    handleData("ebookPrice", e.target.valueAsNumber);
                  }}
                  className="border px-4 py-2 rounded-lg w-full outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="ebook-sale-price">
                  eBook Sale Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter eBook Sale Price"
                  id="ebook-sale-price"
                  name="ebook-sale-price"
                  value={data?.ebookSalePrice ?? ""}
                  onChange={(e) => {
                    handleData("ebookSalePrice", e.target.valueAsNumber);
                  }}
                  className="border px-4 py-2 rounded-lg w-full outline-none"
                />
              </div>

              {/* eBook File Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-500 text-xs">
                  Upload eBook PDF <span className="text-red-500">*</span>
                </label>
                
                {data?.ebookUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="text-green-600" size={24} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">eBook Uploaded</p>
                      <p className="text-xs text-green-600 truncate max-w-[200px]">
                        {data?.ebookUrl?.split("/").pop()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleData("ebookUrl", "")}
                      className="p-1 hover:bg-green-100 rounded-full"
                    >
                      <X className="text-green-600" size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="ebook-file"
                      name="ebook-file"
                      accept=".pdf"
                      disabled={isUploadingEbook}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (!file.type.includes("pdf")) {
                          toast.error("Only PDF files are allowed");
                          return;
                        }

                        if (file.size > 50 * 1024 * 1024) {
                          toast.error("File size must be less than 50MB");
                          return;
                        }

                        setIsUploadingEbook(true);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("productId", data?.id || "new");

                          const response = await fetch("/api/cloudinary/upload", {
                            method: "POST",
                            body: formData,
                          });

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || "Upload failed");
                          }

                          const result = await response.json();
                          handleData("ebookUrl", result.url);
                          toast.success("eBook uploaded successfully!");
                        } catch (error) {
                          toast.error(error.message || "Failed to upload eBook");
                        } finally {
                          setIsUploadingEbook(false);
                          e.target.value = "";
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="ebook-file"
                      className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        isUploadingEbook
                          ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                          : "hover:border-indigo-500 hover:bg-indigo-50 border-gray-300"
                      }`}
                    >
                      {isUploadingEbook ? (
                        <>
                          <Loader2 className="animate-spin text-indigo-600" size={32} />
                          <span className="text-sm text-gray-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400" size={32} />
                          <span className="text-sm text-gray-600">
                            Click to upload PDF (Max 50MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Upload the PDF file that customers will receive after purchase
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
