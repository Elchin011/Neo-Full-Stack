"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QueryKeys } from "@/constants/QueryKeys";
import { BasicTable } from "@/features/common/BasicTable";
import { CommonDialog } from "@/features/common/Dialog";
import { deleteApi, getAPi, postApi, patchProductApi } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import * as yup from "yup";

const CouponList = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editCoupon, setEditCoupon] = useState<any>(null);

  // Kuponları gətir
  const { data, isLoading, refetch } = useQuery({
    queryKey: QueryKeys.coupons.All,
    queryFn: async () => getAPi("/coupons"),
  });

  // Kupon yarat
  const { mutate: createCoupon, isPending: isCreating } = useMutation({
    mutationKey: QueryKeys.coupons.createCoupon,
    mutationFn: async (data: any) => postApi("/coupons/create", data),
    onSuccess: () => {
      formik.resetForm();
      refetch();
      setOpenAddDialog(false);
    },
  });

  // Kupon sil
  const { mutate: deleteCoupon } = useMutation({
    mutationFn: async (id: string) => await deleteApi(`/coupons/${id}`),
    onSuccess: () => {
      refetch();
    },
  });

  // Kupon redaktə
  const { mutate: updateCoupon, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) =>
      patchProductApi(`/coupons/${id}`, values),
    onSuccess: () => {
      formik.resetForm();
      refetch();
      setOpenEditDialog(false);
      setEditCoupon(null);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: editCoupon ? editCoupon?.code : "",
      discountType: editCoupon ? editCoupon?.discountType : "percentage",
      discountValue: editCoupon ? editCoupon?.discountValue : "",
      minPurchase: editCoupon ? editCoupon?.minPurchase : 0,
      expiryDate: editCoupon ? editCoupon?.expiryDate?.split("T")[0] : "",
    },
    validationSchema: yup.object({
      code: yup.string().required("Coupon is required"),
      discountType: yup.string().oneOf(["percentage", "fixed"]).required(),
      discountValue: yup
        .number()
        .required("Discount value is required")
        .min(1, "Minimum 1")
        .max(1000, "Maximum value is too large"),
      minPurchase: yup.number().min(0, "Minimum purchase cannot be less than 0"),
      expiryDate: yup.date().required("Expiry date is required"),
    }),
    onSubmit: (values) => {
      if (editCoupon) {
        updateCoupon({ id: editCoupon._id, values });
      } else {
        createCoupon(values);
      }
    },
  });

  const handleEdit = (coupon: any) => {
    setEditCoupon(coupon);
    setOpenEditDialog(true);
    formik.setValues({
      code: coupon?.code,
      discountType: coupon?.discountType,
      discountValue: coupon?.discountValue,
      minPurchase: coupon?.minPurchase,
      expiryDate: coupon?.expiryDate?.split("T")[0],
    });
  };

  const columns = ["Code", "Discount", "Min. Amount", "Expiry Date", "Actions"];
  const rows =
    data &&
    data?.map((item: any) => ({
      Code: item?.code,
      Discount:
        item?.discountType === "percentage"
          ? `${item?.discountValue}%`
          : `${item?.discountValue} $`,
      "Min. Amount": `${item?.minPurchase} $`,
      "Expiry Date": new Date(item?.expiryDate).toLocaleDateString(),
      Actions: (
        <div className="flex items-center gap-2">
          <Button
            className="bg-blue-500 text-white hover:text-white p-1.5 px-2.5 rounded-md hover:bg-blue-600"
            variant="outline"
            onClick={() => handleEdit(item)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            className="bg-red-500 text-white hover:text-white p-1.5 px-2.5 rounded-md hover:bg-red-600"
            variant="outline"
            onClick={() => {
              if (confirm("Are you sure you want to delete this coupon?")) {
                deleteCoupon(item?._id);
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    }));

  return (
    <div>
      <div className="flex items-center my-5 justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Coupon List</h1>
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => setOpenAddDialog(true)}
        >
          Create Coupon
        </Button>
      </div>

      <BasicTable cols={columns} rows={rows} isLoading={isLoading} />

      {(openAddDialog || openEditDialog) && (
        <CommonDialog
          open={openAddDialog || openEditDialog}
          onClose={() => {
            setOpenAddDialog(false);
            setOpenEditDialog(false);
            setEditCoupon(null);
            formik.resetForm();
          }}
          title={openEditDialog ? "Edit Coupon" : "Create Coupon"}
        >
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            className="space-y-4 grid grid-cols-1 gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  placeholder="E.g: NEO10"
                  onBlur={formik.handleBlur}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="discountType">Coupon Type</Label>
                <select
                  name="discountType"
                  value={formik.values.discountType}
                  onChange={formik.handleChange}
                  className="w-full border rounded-md p-2 mt-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <Label htmlFor="discountValue">Coupon Value</Label>
                <Input
                  name="discountValue"
                  type="number"
                  value={formik.values.discountValue}
                  onChange={formik.handleChange}
                  placeholder="10"
                  onBlur={formik.handleBlur}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="minPurchase">Minimum Amount</Label>
                <Input
                  name="minPurchase"
                  type="number"
                  value={formik.values.minPurchase}
                  onChange={formik.handleChange}
                  placeholder="0"
                  onBlur={formik.handleBlur}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  name="expiryDate"
                  type="date"
                  value={formik.values.expiryDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Button
                disabled={isCreating || isUpdating}
                className="w-full block mt-4 py-4"
                type="submit"
              >
                {openEditDialog
                  ? isUpdating
                    ? "Updating..."
                    : "Update"
                  : isCreating
                    ? "Creating..."
                    : "Create"}
              </Button>
            </div>
          </form>
        </CommonDialog>
      )}
    </div>
  );
};

export default CouponList;
