"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/Providers/CartProvider";
import { ChevronUp, Facebook, Heart, Instagram, LogOutIcon, Mail, Menu, ShoppingBag, Twitch, Twitter, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { RegisterValidation } from "@/features/Register/validate/RegisterValidate";
import { useFormik } from "formik";
import { postApi } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/QueryKeys";
import { useRouter } from "next/navigation";
import RegisterForm from "@/features/Register/components";
import LoginForm from "@/features/Login/components/LoginForm";
import UserMenu from "@/features/common/UserDIolog";
import dynamic from "next/dynamic";

export const Header = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItems,
    getCartSummary,
  } = useCart();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;


      const UserMenuNoSSr = dynamic (() => import("@/features/common/UserDIolog"), { ssr: false });


  const router = useRouter()

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: QueryKeys.register,
    mutationFn: async (data: any) => postApi('/auth/register', data),
  })

  const initalVAlue = {
    email: "",
    password: "",
    name: ""
  }
  const formik = useFormik({
    initialValues: initalVAlue,
    validationSchema: RegisterValidation,
    onSubmit: () => {
      mutate(formik.values, {
        onSuccess: (data: any) => {
          console.log("Registration successful:", data);
          formik.resetForm();
          router.push("/login");
        }
      })
    }
  })


  const [activeTab, setActiveTab] = useState("tab1");



  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const cartCount = getCartItems().length;


  return (
    <div>
      <div className="bg-black py-2">
        <div className="container mx-auto grid grid-cols-2">
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center gap-2 text-white text-sm">
              <div className="flex items-center gap-3">
                <Instagram size={15} color='white' fill='black' />
                <Facebook size={15} color='white' fill='black' />
                <Twitch size={15} color='white' fill='black' />
                <Twitter size={15} color='white' fill='black' />
              </div>
              <div>
                <p>
                  <Mail />
                  neoocular@example.com
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="">
        <header className="py-7  bg-white grid grid-cols-12 items-center px-5 md:px-10 lg:px-25">
          <div className="col-span-2">
            <img className="w-[100px] object-contain" src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/09/logo-img-04.png" alt="" />
          </div>
          <div className="col-span-8 flex items-center justify-center">
            <nav>
              <ul className="hidden lg:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                <li className="relative group mx-3">
                  <Link
                    href="/"
                    className="text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem] cursor-pointer"
                  >
                    HOME
                    <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <div className="absolute -left-6 top-full hidden group-hover:block bg-white mt-1 z-10 whitespace-nowrap">
                    <ul className="pt-10 pl-7 pr-15 pb-7 space-y-2">
                      <li>
                        <Link
                          href="/home"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Main Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Optician Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Ophthalmology Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Shop Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Eyewear Home
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="relative group mx-3">
                  <Link
                    href="/"
                    className="text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem] cursor-pointer"
                  >
                    PAGES
                    <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </Link>


                  <div className="absolute -left-6 top-full hidden group-hover:block bg-white mt-2 z-10 whitespace-nowrap">
                    <ul className="pt-10 pl-7 pr-15 pb-7 space-y-2">
                      <li>
                        <Link
                          href="/about"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/who-we-are"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Who We Are
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/our-staff"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Our Staff
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/meet-the-doctor"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Meet The Doctor
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/vouchers"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Vouchers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/pricing-plans"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Pricing Plans
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/bkappointment"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Book An Appointment
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Get In Touch
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact-us"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/faq"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          FAQ Page
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li><Link href="/shops" className="text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem] relative group cursor-pointer mx-3">SHOP
                  <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                </li>
                <li className="relative group mx-3">
                  <Link
                    href="/blog"
                    className="text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem] cursor-pointer"
                  >
                    BLOG
                    <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <div className="absolute -left-6 top-full hidden group-hover:block bg-white mt-1 z-10 whitespace-nowrap">
                    <ul className="pt-10 pl-7 pr-15 pb-7 space-y-2">
                      <li>
                        <Link
                          href="/home"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Right Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Left Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          No Sidebar
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home2"
                          className="inline-flex text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem]"
                        >
                          Post Types
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li><Link href="#" className="text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem] relative group cursor-pointer  mx-3">LANDING
                  <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-span-2 flex justify-end items-center gap-4">
            <div className="items-center flex gap-4 justify-end border-r border-gray-200 pr-4 ">
              <div className="hidden lg:flex items-center gap-4">
                <Heart strokeWidth={1.5} size={18} />
                <button
                  onClick={() => setOpen(true)}
                  className="border-none"
                >
                  <UserRound strokeWidth={1.5} size={18} />
                </button>
              </div>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingBag strokeWidth={1.5} size={18} />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 text-[9px] -right-1.5 bg-black text-white text-xs rounded-full px-1">
                      {cartCount}
                    </div>
                  )}
                </div>
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <UserMenuNoSSr user={user} />
            </div>
            <div>

              <div className="relative block pt-2 lg:hidden">
                {/* Menu Button */}
                <button onClick={() => setOpenMenu(true)}>
                  <Menu strokeWidth={1} className="w-6 h-6" />
                </button>

                {/* Fullscreen Modal */}
                {openMenu && (
                  <div className="absolute top-10 -left-130 w-full flex justify-center items-center">
                    <div className="bg-white w-full h-full flex  items-center justify-center gap-6 text-xl font-semibold">

                      <button
                        className="absolute top-4 right-4 text-gray-700 text-2xl"
                        onClick={() => setOpenMenu(false)}
                      >
                        ✕
                      </button>

                      <Link
                        href="/"
                        className="text-[#1c1c1c] text-[14px] font-medium tracking-[0.1rem] cursor-pointer"
                      >
                        HOME
                        <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                      <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                      <Link href="/shops" className="hover:text-blue-600">Shop</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


        </header>
        <div>
          <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
              transition
              className="fixed inset-0 shadow-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                  transition
                  className="relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="max-w-md mx-auto mt-10 p-4">
                        <div className="flex border-b mb-4">
                          <button
                            className={`w-1/2 py-2 font-semibold ${activeTab === "tab1" ? "border-b-2 border-black text-black" : "text-gray-500"
                              }`}
                            onClick={() => setActiveTab("tab1")}
                          >
                            Login
                          </button>
                          <button
                            className={`w-1/2 py-2 font-semibold ${activeTab === "tab2" ? "border-b-2 border-black text-black" : "text-gray-500"
                              }`}
                            onClick={() => setActiveTab("tab2")}
                          >
                            Register
                          </button>
                        </div>


                        <div className="text-center text-lg font-medium">
                          {activeTab === "tab1" &&
                            <LoginForm />
                          }
                          {activeTab === "tab2" &&
                            <RegisterForm onRegisterSuccess={() => setActiveTab("tab1")} />
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </div>
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-[11px] bg-black text-white shadow-lg hover:bg-gray-800 transition"
            aria-label="Scroll to top"
          >
            <ChevronUp size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
