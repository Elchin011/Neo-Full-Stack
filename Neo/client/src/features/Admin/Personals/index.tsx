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
import { deleteApi, getAPi, postApi, patchApi, patchProductApi } from "@/http/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Pencil, Trash2, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import * as yup from "yup";

const PersonalList = () => {
  // Modal açılıb-bağlanma state-ləri
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Edit üçün seçilmiş şəxsin məlumatları
  const [editPerson, setEditPerson] = useState<any>(null);

  // Data çəkirik
  const { data, isLoading, refetch } = useQuery({
    queryKey: QueryKeys.persons.All,
    queryFn: async () => getAPi("/persons"),
  });

  const {
    data: specialties,
    isLoading: specialIsLoading,
    isError: specialIsErr,
  } = useQuery({
    queryKey: QueryKeys.persons.specialties,
    queryFn: async () => getAPi("/persons/specialties"),
  });

  // Yeni şəxs yaratmaq mutation
  const {
    mutate: createPerson,
    isPending: createPending,
    isError: createIsErr,
    error: createErr,
  } = useMutation({
    mutationKey: QueryKeys.persons.createPerson,
    mutationFn: async (data: any) => postApi("/persons/create", data),
    onSuccess: () => {
      formik.resetForm();
      refetch();
      setOpenAddDialog(false);
    },
  });

  // Şəxsi silmək mutation
  const {
    mutate: deletePerson,
    isPending: deletePending,
  } = useMutation({
    mutationFn: async (id: string) => deleteApi(`/persons/${id}`),
    onSuccess: () => {
      refetch();
    },
  });

  // Şəxsi yeniləmək mutation (PATCH metodu ilə)
  const {
    mutate: updatePerson,
    isPending: updatePending,
  } = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      return patchProductApi(`/persons/${id}`, formData);
    },
    onSuccess: () => {
      formik.resetForm();
      refetch();
      setOpenEditDialog(false);
      setEditPerson(null);
    },
  });


  // Formik form
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editPerson ? editPerson.name : "",
      specialty: editPerson ? editPerson.specialty : "",
      imageUrl: editPerson ? editPerson?.imageUrl : "" as string | File,
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      specialty: yup.string().required("Specialty is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.imageUrl && typeof values.imageUrl !== "string") {
        formData.append("file", values.imageUrl);
      }
      formData.append("specialty", values.specialty);
      if (editPerson) {
        updatePerson({ id: editPerson._id, formData });
      } else {
        createPerson(formData);
      }
    },
  });

  const handleEditClick = (person: any) => {
    setEditPerson(person);
    setOpenEditDialog(true);
  };

  const columns = ["Id", "Name", "Specialty", "Image", "Actions"];

  const rows =
    data?.data?.map((item: any) => ({
      Id: item?._id,
      Name: item?.name,
      Specialty: typeof item?.specialty === "object" ? item?.specialty?.name : item?.specialty,
      Image: (
        <img
          src={item?.imageUrl}
          alt={item?.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
      Actions: (
        <div className="flex items-center gap-2">
          <Button
            className="bg-blue-500 text-white hover:text-white p-1.5 px-2.5 rounded-md hover:bg-blue-600"
            variant="outline"
            onClick={() => handleEditClick(item)}
          >
            <Pencil />
          </Button>
          <Button
            className="bg-red-500 text-white hover:text-white p-1.5 px-2.5 rounded-md hover:bg-red-600"
            variant="outline"
            onClick={() => {
              if (confirm("Are you sure you want to delete this person?")) {
                deletePerson(item._id);
              }
            }}
            disabled={deletePending}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    })) || [];

  return (
    <div>
      <div className="flex items-center my-5 justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Person Lists</h1>
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => {
            setEditPerson(null);
            setOpenAddDialog(true);
            formik.resetForm();
          }}
        >
          Add Person
        </Button>
      </div>

      <BasicTable cols={columns} rows={rows} isLoading={isLoading} />

      {/* Modal (Add və Edit üçün eyni modal) */}
      {(openAddDialog || openEditDialog) && (
        <CommonDialog
          open={openAddDialog || openEditDialog}
          onClose={() => {
            setOpenAddDialog(false);
            setOpenEditDialog(false);
            setEditPerson(null);
            formik.resetForm();
          }}
          title={openEditDialog ? "Edit Person" : "Add Person"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            {(createIsErr || formik.errors.name || formik.errors.specialty) && (
              <div className="bg-red-100 text-red-500 rounded-2xl p-4 mb-3">
                {createErr?.message ||
                  (typeof formik.errors.name === "string" && formik.errors.name) ||
                  (typeof formik.errors.specialty === "string" && formik.errors.specialty)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter the Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
              </div>

              <div>
                <Label className="mb-2" htmlFor="specialty">
                  Select Specialty
                </Label>
                <Select
                  name="specialty"
                  onValueChange={(value) => formik.setFieldValue("specialty", value)}
                  value={formik.values.specialty}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {specialties?.data?.map((specialty: any) => (
                        <SelectItem key={specialty._id} value={specialty._id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center w-full mt-5">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-10 h-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
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

              {/* Upload olunan faylın adı və ölçüsü */}
              {formik.values.imageUrl && (
                typeof formik.values.imageUrl === "string" ? (
                  <img src={formik.values.imageUrl} alt="Preview" className="w-24 h-24 object-cover mt-2 rounded-md" />
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
              disabled={createPending || updatePending}
              className="my-4 py-4 rounded-md w-full"
              type="submit"
            >
              {openEditDialog
                ? updatePending
                  ? "Updating..."
                  : "Update"
                : createPending
                  ? "Creating..."
                  : "Create"}
            </Button>
          </form>
        </CommonDialog>
      )}
    </div>
  );
};

export default PersonalList;
