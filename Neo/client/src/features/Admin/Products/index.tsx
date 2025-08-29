"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryKeys } from "@/constants/QueryKeys";
import { BasicTable } from "@/features/common/BasicTable";
import { CommonDialog } from "@/features/common/Dialog";
import { deleteApi, getAPi, patchProductApi, postApi } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Pencil, Trash2, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import * as yup from "yup";

const ProductList = () => {
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);


  const [editProduct, setEditProduct] = useState<any>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QueryKeys.products.All,
    queryFn: async () => {
      return getAPi("/products");
    },
  });
  const {
    data: colors,
    isLoading: colorsIsloading,
    isError: colorsIserr,
    error: colorsErr,
  } = useQuery({
    queryKey: QueryKeys.products.colors,
    queryFn: async () => {
      return getAPi("/products/colors");
    },
  });
  const {
    data: categories,
    isLoading: categoryIsLoading,
    isError: categoryIsErr,
    error: categoryErr,
  } = useQuery({
    queryKey: QueryKeys.products.categories,
    queryFn: async () => {
      return getAPi("/products/categories");
    },
  });
  const {
    data: productSizes,
    isLoading: sizeIsLoading,
    isError: sizeIsErr,
    error: sizeErr,
  } = useQuery({
    queryKey: QueryKeys.products.sizes,
    queryFn: async () => {
      return getAPi("/products/sizes");
    },
  });

  const {
    mutate: createProduct,
    isPending,
    isError: createIsErr,
    error: createErr,
  } = useMutation({
    mutationKey: QueryKeys.products.createSize,
    mutationFn: async (data: any) => postApi("/product/create", data),
    onSuccess: () => {
      formik.resetForm();
      refetch();
      setOpenAddDialog(false);
    },
    onError: () => {
      console.log(createErr);
    },
  });

  const {
    mutate: deleteProduct,
    isPending: deletePending,
  } = useMutation({

    mutationFn: async (id: string) => await deleteApi(`/products/${id}`),
    onSuccess: () => {
      refetch();
    },
  });

  const {
    mutate: updateProduct,
    isPending: updatePending,
  } = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return patchProductApi(`/products/${id}`, formData);
    },
    onSuccess: () => {
      formik.resetForm();
      refetch();
      setOpenAddDialog(false);
      setEditProduct(null);
    },
  });


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editProduct ? editProduct.name : "",
      price: editProduct ? editProduct.price : "",
      colors: editProduct ? editProduct.colors : "",
      categories: editProduct ? editProduct.categories : "",
      sizes: editProduct ? editProduct.sizes : "",
      stockQuantity: editProduct ? editProduct.stockQuantity : "",
      imageUrl: editProduct ? editProduct.imageUrl : "" as string | File,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      price: yup.number().required("Price is required").positive("Price must be positive"),
      colors: yup.string().required("Color is required"),
      categories: yup.string().required("Category is required"),
      sizes: yup.string().required("Size is required"),
      stockQuantity: yup.number().required("Stock Quantity is required").min(0, "Stock Quantity cannot be negative"),
      imageUrl: yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("colors", values.colors);
      formData.append("categories", values.categories);
      formData.append("sizes", values.sizes);
      formData.append("stockQuantity", values.stockQuantity);
      if (values.imageUrl && typeof values.imageUrl !== "string") {
        formData.append("file", values.imageUrl);
      }

      if (editProduct) {
        updateProduct({ id: editProduct._id, formData });
      }
      else {
        createProduct(formData);
      }
    },
  });


  const handleEditProduct = (product: any) => {
    setEditProduct(product);
    setOpenAddDialog(true);
  }

  const columns = ["Id", "Name", "Price", "Image", "Actions"];

  const rows =
    data &&
    data?.data?.map((item: any) => {
      return {
        Id: item?._id,
        Name: item?.name,
        Price: item?.price,
        Image: (
          <div>
            <img
              src={item?.imageUrl}
              alt={item?.name}
              className="w-16 h-16 object-contain rounded-md"
            />
          </div>
        ),
        Actions: (
          <div className="flex items-center gap-2">
            <Button
              className="bg-blue-500 text-white p-1.5 px-2.5 rounded-md hover:bg-blue-600 hover:text-white duration-300"
              variant="outline"
              onClick={() => {
                handleEditProduct(item);
              }}
            >
              <Pencil />
            </Button>
            <Button
              className="bg-red-500 text-white p-1.5 px-2.5 rounded-md hover:bg-red-600 hover:text-white duration-300"
              variant="outline"
              onClick={() => {
                if (confirm("Are you sure you want to delete this product?")) {
                  deleteProduct(item?._id);
                }
              }}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      };
    });
  return (
    <div>
      <div className="flex items-center my-5 justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Products Lists</h1>
        <Button
          className="bg-green-500 text-[14px] text-white px-4 py-2 rounded-md hover:bg-green-600 hover:text-white duration-300"
          onClick={() => {
            setOpenAddDialog(true);
            formik.resetForm();
          }}
        >
          Add Product
        </Button>
      </div>
      <BasicTable cols={columns} rows={rows} isLoading={isLoading} />
      {openAddDialog && (
        <CommonDialog
          open={openAddDialog || Boolean(editProduct)}
          onClose={() => {
            setOpenAddDialog(false);
            setEditProduct(null);
            formik.resetForm();
          }}
          title={Boolean(editProduct) ? "Edit Product" : "Create Product"}
        >
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            {createIsErr && (
              <div className="bg-red-100 text-red-500 rounded-2xl p-4">
                {createErr?.message}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="name">
                  {" "}
                  Name
                </Label>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  name="name"
                  type="text"
                  placeholder="Enter the Product Name."
                />
                {formik.touched.name && typeof formik.errors.name === "string" && (
                  <div className="text-sm mt-1 font-medium text-red-500">
                    {formik.errors.name}
                  </div>
                )}
              </div>
              <div>
                <Label className="mb-2" htmlFor="price">
                  {" "}
                  Price
                </Label>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  name="price"
                  type="number"
                  placeholder="Enter the Price"
                />
                {formik.touched.price && typeof formik.errors.price === "string" && (
                  <div className="text-sm mt-1 font-medium text-red-500">
                    {formik.errors.price}
                  </div>
                )}
              </div>
              <div>
                <Label className="mb-2" htmlFor="name">
                  {" "}
                  Select Colors
                </Label>
                <Select
                  name="colors"
                  value={formik.values.colors}
                  onValueChange={(value) => {
                    formik.setFieldValue("colors", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {colors &&
                        colors?.data?.map((color: any) => (
                          <SelectItem key={color?._id} value={color?._id}>
                            {color?.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.colors && typeof formik.errors.colors === "string" && (
                  <div className="text-sm mt-1 font-medium text-red-500">
                    {formik.errors.colors}
                  </div>
                )}
              </div>
              <div>
                <Label className="mb-2" htmlFor="name">
                  {" "}
                  Select Category
                </Label>
                <Select
                  name="categories"
                  value={formik.values.categories}
                  onValueChange={(value) => {
                    formik.setFieldValue("categories", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories &&
                        categories?.data?.map((category: any) => (
                          <SelectItem key={category?._id} value={category?._id}>
                            {category?.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.categories && typeof formik.errors.categories === "string" && (
                  <div className="text-sm mt-1 font-medium text-red-500">
                    {formik.errors.categories}
                  </div>
                )}
              </div>
              <div>
                <Label className="mb-2" htmlFor="name">
                  {" "}
                  Select Sizes
                </Label>
                <Select
                  name="sizes"
                  value={formik.values.sizes}
                  onValueChange={(value) => {
                    formik.setFieldValue("sizes", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {productSizes &&
                        productSizes?.data?.map((size: any) => (
                          <SelectItem key={size?._id} value={size?._id}>
                            {size?.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.sizes && typeof formik.errors.sizes === "string" && (
                  <div className="text-sm mt-1 font-medium text-red-500">
                    {formik.errors.sizes}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <Label className="mb-2" htmlFor="stockQuantity">
                  {" "}
                  StockQuantity
                </Label>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.stockQuantity}
                  name="stockQuantity"
                  type="number"
                  placeholder="enter the stockQuantity "
                />
                {formik.touched.stockQuantity && typeof formik.errors.stockQuantity === "string" && (
                  <div className="text-sm mt-1 font-medium text-red-500">
                    {formik.errors.stockQuantity}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-10 h-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        formik.setFieldValue("imageUrl", file);
                      }
                    }}
                  />
                </label>
              </div>
              {formik.values.imageUrl && (
                typeof formik.values.imageUrl === "string" ? (
                  <img src={formik.values.imageUrl} alt="Preview" className="w-32 h-32 object-contain mt-2 rounded-md" />
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{formik.values.imageUrl.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(formik.values.imageUrl.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
            <Button
              disabled={isPending || updatePending}
              className="my-4 py-4 rounded-md w-full"
              type="submit"
            >
              {Boolean(editProduct)
                ? updatePending
                  ? "Updating..."
                  : "Update"
                : isPending
                  ? "Creating..."
                  : "Create"}
            </Button>
          </form>
        </CommonDialog>
      )}
    </div>
  );
}


export default ProductList;
