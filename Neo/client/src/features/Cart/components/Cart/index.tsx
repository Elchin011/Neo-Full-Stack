"use client";

import { useCart } from "@/Providers/CartProvider";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Cart() {
    const { addToCart, removeFromCart, getCartItems, deleteFromCart } = useCart();
    const data = getCartItems();

    // Cart total hesabla
    const cartTotal = Array.isArray(data) && data.length > 0
        ? data.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0)
        : 0;

    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(cartTotal);
    const [message, setMessage] = useState<{ text: string; color: string } | null>(null);


    useEffect(() => {
        const savedFinal = localStorage.getItem("discountedTotal");
        if (savedFinal) {
            const final = Number(savedFinal);
            setFinalPrice(final);
            setDiscount(cartTotal - final);
        } else {
            setFinalPrice(cartTotal);
            setDiscount(0);
        }
    }, [cartTotal]);

    const applyCoupon = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, total: cartTotal }),
            });

            const data = await res.json();
            if (data.success) {

                const discountValue = Number(data.discount);
                const final = Number(data.finalPrice);

                setDiscount(discountValue);
                setFinalPrice(final);
                setMessage({ text: "Coupon applied successfully!", color: "green" });

                localStorage.setItem("discountedTotal", JSON.stringify(final));
                localStorage.setItem("appliedCoupon", JSON.stringify(couponCode));

                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ text: data.message, color: "red" });
                setDiscount(0);
                setFinalPrice(cartTotal);
                localStorage.removeItem("discountedTotal");
                localStorage.removeItem("appliedCoupon");
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setMessage({ text: "An error occurred while applying the coupon.", color: "red" });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div>
            <div className="container mx-auto pt-14 pb-35">
                <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        {data && data.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <p className="text-[17px] md:text-[17px] ml-[215px] dark:text-white font-semibold uppercase">
                                            Product
                                        </p>
                                        <p className="text-[17px] md:text-[17px] pl-[250px] dark:text-white font-semibold uppercase">
                                            Price
                                        </p>
                                        <p className="text-[17px] md:text-[17px] pl-[103px] dark:text-white font-semibold uppercase">
                                            Quantity
                                        </p>
                                    </div>
                                    <p className="text-[17px] md:text-[17px] pl-[38px] dark:text-white font-semibold uppercase">
                                        Subtotal
                                    </p>
                                </div>
                                {data.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-center md:items-center md:space-x-6 xl:space-x-8 w-full border-b border-gray-200"
                                    >
                                        <button onClick={() => deleteFromCart(item)} className="mb-6" aria-label="Remove item">
                                            <X size={20} />
                                        </button>

                                        <div className="pb-4 md:pb-8 w-full md:w-40">
                                            <img className="w-full hidden md:block" src={item?.imageUrl} alt={item?.name} />
                                            <img className="w-full md:hidden" src={item?.imageUrl} alt={item?.name} />
                                        </div>

                                        <div className="md:flex-row flex-col flex justify-between items-center w-full pb-8 space-y-4 md:space-y-0">
                                            <div className="grid grid-cols-3 items-center gap-10">
                                                <div className="w-[300px] flex flex-col justify-start items-start">
                                                    <h3 className="text-[16px] dark:text-white xl:text-xl font-semibold">
                                                        {item?.name || "Product Name"}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-col justify-between space-y-3 items-start w-full md:flex-row md:items-center md:space-y-0 md:space-x-8">
                                                    <p className="text-base text-[#565656] dark:text-white xl:text-[16px] leading-6">
                                                        {item?.price ? `$${item.price.toFixed(2)}` : "$0.00"}
                                                    </p>
                                                    <div className="flex items-center space-x-4 border border-gray-200">
                                                        <button onClick={() => removeFromCart(item)} className="p-4">
                                                            <Minus size={17} strokeWidth={1} />
                                                        </button>
                                                        <span className="text-lg">{item.quantity || 1}</span>
                                                        <button onClick={() => addToCart(item)} className="p-4">
                                                            <Plus size={17} strokeWidth={1} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[100px] text-[16px] text-[#565656]">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 flex gap-5">
                                    <input
                                        type="text"
                                        placeholder="Coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="border px-4 flex-1 outline-none focus:ring-0"
                                    />
                                    <button onClick={applyCoupon} className="text-[12px] py-4 px-8.5 bg-white text-black font-medium uppercase tracking-[1.95px] border border-black hover:bg-black hover:text-white duration-500">
                                        Apply Coupon
                                    </button>
                                </div>
                                {message && (
                                    <div
                                        className={`px-6 py-2.5 text-[12px] font-medium tracking-wider shadow-sm transition-all uppercase duration-300
                                        ${message.color === "red" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                                    >
                                        {message.text}
                                    </div>
                                )}

                                <div className="mt-20 w-full">
                                    <h3 className="text-[30px] dark:text-white font-semibold uppercase mb-7.5">
                                        Cart Totals
                                    </h3>
                                    <div className="flex items-center gap-40 py-9 border-b border-gray-200 w-full">
                                        <h4 className="text-[17px] font-semibold uppercase">Subtotal</h4>
                                        <p className="text-[16px] text-[#565656] dark:text-white">
                                            ${cartTotal.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-40 py-9 border-b border-gray-200 w-full">
                                        <h4 className="text-[17px] font-semibold uppercase">Discount</h4>
                                        <p className="text-[16px] text-[#565656] dark:text-white">{discount > 0 ? `-$${discount.toFixed(2)}` : "$0"}</p>
                                    </div>
                                    <div className="flex items-center gap-49 py-9 border-b border-gray-200 mb-20">
                                        <h4 className="text-[17px] font-semibold uppercase">Total</h4>
                                        <p className="text-[16px] text-[#565656] dark:text-white">
                                            ${finalPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="text-[13px] py-5 px-8.5 bg-white text-black font-medium uppercase tracking-[1.95px] border border-black hover:bg-black hover:text-white duration-500"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-64">
                                <div className="border border-gray-200 text-end w-full px-7.5 py-5 mb-7.5">
                                    <h2 className="text-[16px]">Your cart is empty</h2>
                                </div>
                                <Link
                                    href="/shops"
                                    className="text-[13px] py-3.5 px-13 bg-[#1c1c1c] text-white font-medium uppercase border border-black hover:bg-black hover:text-white duration-500"
                                >
                                    Return to shop
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
