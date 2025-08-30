"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryKeys } from "@/constants/QueryKeys";
import { BasicTable } from "@/features/common/BasicTable";
import { CommonDialog } from "@/features/common/Dialog";
import { deleteApi, getAPi, patchAppointmentApi } from "@/http/api";
import { AppointmentStatus } from "@/lib/appointment";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

const AppointmentList = () => {
  const [openModalIsEditStatus, setIsOpenModalIsEditStatus] =
    useState<boolean>(false);
  const [appointmentStatus, setStatus] = useState<string>("");
  const [selectAppointmentId, setSelectAppointmentId] = useState<string>("");
  const [formStatus, setFormStatus] = useState<string>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: QueryKeys.appointments.All,
    queryFn: async () => getAPi("/appointments/dashboard"),
  });

  const {
    mutate: deleteAppointment,
    status: deleteStatus,
  } = useMutation({
    mutationFn: (id: string) => deleteApi(`/appointments/${id}`),
    onSuccess: () => refetch(),
  });

  const isDeleting = deleteStatus === "pending";

  const columns = ["Id", "Patient", "Doctor", "Date", "Time", "Status", "Actions"];

  const rows =
    data &&
    data?.data?.map((item: any) => ({
      Id: item._id,
      Patient: `${item.firstName} ${item.lastname}`,
      Doctor: item.doctor?.name || "N/A",
      Date: new Date(item.date).toLocaleDateString(),
      Time: item.time,
      Status: (
        <Button
          onClick={() => {
            setIsOpenModalIsEditStatus(true);
            setStatus(item.status);
            setSelectAppointmentId(item._id);
          }}
          disabled={item.status === "completed"}
          className={`text-[14px] px-4 py-2 rounded-md ${AppointmentStatus(item.status)}`}
        >
          {item.status}
        </Button>
      ),
      Actions: (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            className="bg-blue-500 text-[14px] text-white hover:text-white p-1.5 px-2.5 rounded-md hover:bg-blue-600 duration-300"
            onClick={() => {
              setIsOpenModalIsEditStatus(true);
              setStatus(item.status);
              setSelectAppointmentId(item._id);
            }}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            className="bg-red-500 text-white hover:text-white p-1.5 px-2.5 rounded-md hover:bg-red-600 duration-300"
            onClick={() => deleteAppointment(item._id)}
            disabled={isDeleting}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    }));

  const statusOptions = [
    { id: 1, name: "Pending", value: "pending" },
    { id: 2, name: "Confirmed", value: "confirmed" },
    { id: 3, name: "Cancelled", value: "cancelled" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      patchAppointmentApi(`/appointments/${selectAppointmentId}/status`, data),
    onSuccess: () => {
      selectAppointmentId && refetch();
      setIsOpenModalIsEditStatus(false);
      setStatus("");
      setSelectAppointmentId("");
    },
  });

  const handleUpdateStatus = () => {
    mutate({ status: formStatus });
  };

  return (
    <div>
      <div className="flex items-center my-5 justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Appointments List</h1>
      </div>
      <BasicTable cols={columns} rows={rows} isLoading={isLoading} />
      {openModalIsEditStatus && (
        <CommonDialog
          open={openModalIsEditStatus}
          onClose={() => {
            setIsOpenModalIsEditStatus(false);
            setStatus("");
            setSelectAppointmentId("");
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateStatus();
            }}
          >
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Change Appointment Status
            </Label>
            <Select onValueChange={(value: string) => setFormStatus(value)}>
              <SelectTrigger className="w-[520px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {statusOptions.map((item) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              disabled={isPending}
              className="mt-3 px-4 py-2 bg-white text-black border rounded-sm uppercase text-[12px] tracking-[0.4px]"
              type="submit"
            >
              {isPending ? "Updating..." : "Update Status"}
            </Button>
          </form>
        </CommonDialog>
      )}
    </div>
  );
};

export default AppointmentList;
