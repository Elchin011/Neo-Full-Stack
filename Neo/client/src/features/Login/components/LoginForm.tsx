"use client";
import React from "react";
import { useFormik } from "formik";
import { ValidationSchema } from "../Validate";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/QueryKeys";
import { postApi } from "@/http/api";
import { setCookie } from "cookies-next/client";


interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {

  const router = useRouter();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: QueryKeys.login,
    mutationFn: async (data: any) => postApi("/auth/login", data),
  });
  const initalVAlue = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues: initalVAlue,
    validationSchema: ValidationSchema,
    onSubmit: () => {
      mutate(formik.values, {
        onSuccess: (data) => {
          setCookie("token", data.token, {
            maxAge: 60 * 60 * 24 * 7,
          });
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data.user));
          formik.resetForm();
          onLoginSuccess(data.user);
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      });
    },
  });

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white px-8  w-2xl">
        {isError ? (
          <div className="bg-red-100 text-red-500 p-2 rounded-md mb-4">
            <p className="text-sm">{error.message}</p>
          </div>
        ) : null}
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          id="loginForm"
          className="space-y-6"
        >
          <div>
            <input
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              type="email"
              id="email"
              placeholder="Email *"
              className="mt-1 block w-full outline-none py-4 px-4 border border-[#eee] text-center focus:outline-none focus:ring-0"
            />
            {formik.touched && formik.errors.email ? (
              <div>
                <span className="text-red-400 text-sm">
                  {formik.errors.email}
                </span>
              </div>
            ) : null}
          </div>

          <div>
            <input
              onChange={formik.handleChange}
              value={formik.values.password}
              name="password"
              type="password"
              id="password"
              placeholder="Password *"
              className="mt-1 block w-full outline-none py-4 px-4 border border-[#eee] text-center focus:outline-none focus:ring-0"
            />
            {formik.touched && formik.errors.password ? (
              <div>
                <span className="text-red-400 text-sm">
                  {formik.errors.password}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              className="text-[15px] text-[#565656]"
            >
              Lost Your Password?
            </button>
            <button
              type="submit"
              className="outline-none flex justify-center py-4 px-16 border border-transparent  tracking-[0.15rem] text-[13px] font-medium text-white bg-black hover:bg-black focus:outline-none focus:ring-offset-2 focus:ring-0"
            >
              {isPending ? "Loading..." : "LOGIN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
