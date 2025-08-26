"use client";
import { postApi } from "@/http/api";
import { useCart } from "@/Providers/CartProvider";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { getCartItems, getTotalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("appliedCoupon") || '""') : ""
  );



  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user._id) {
      setError("Please log in first.");
      return;
    }

    if (!cartItems.length) {
      setError("Cart is empty");
      return;
    }

    try {
      const orderData = {
        user: user._id,
        products: cartItems.map((item: any) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        totalAmount,
        couponCode: couponCode || null, 
        address,
        firstName,
        lastname,
        email,
        phone,
      };

      mutate(orderData, {
        onSuccess: () => {
          clearCart();
          setSuccess(true);
        },
        onError: (err: any) => {
          console.error("Order error:", err);
          setError("Failed to create order. Try again.");
        },
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };


  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
  const cartItems = getCartItems();
  const totalAmount = getTotalPrice();

  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(totalAmount);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDiscount = Number(localStorage.getItem("discountedTotal") || 0);
      if (storedDiscount > 0) {
        setDiscount(totalAmount - storedDiscount); // real endirim məbləği
        setFinalTotal(storedDiscount); // final qiymət
      } else {
        setDiscount(0);
        setFinalTotal(totalAmount);
      }
    }
  }, [totalAmount]);

  const {
    mutate,
    isPending,
    isError,
    error: OrderCreateErr,
  } = useMutation({
    mutationFn: async (data: any) => postApi("/create/order", data),
    mutationKey: ["createOrder"],
  });




  // const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  // );

  const data = getCartItems();

  // const handleCheckout = async () => {
  //   const stripe = await stripePromise;
  //   if (!stripe) {
  //     console.error("Stripe not loaded");
  //     return;
  //   }
  //   const response = await fetch("/api/checkout-sessions/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       cartItems: data.map((item: any) => ({
  //         name: item.name,
  //         image: item.imageUrl,
  //         price: item.price,
  //         quantity: item.quantity,
  //       })),
  //       returnUrl: window.location.origin,
  //     }),
  //   });
  //   if (!response.ok) {
  //     console.error("Failed to create checkout session");
  //     return;
  //   }
  //   const session = await response.json();
  //   const result = await stripe.redirectToCheckout({
  //     sessionId: session.sessionId,
  //   });
  //   if (result.error) {
  //     console.error("Stripe checkout error:", result.error.message);
  //   }
  // };

  return (
    <div className="container mx-auto px-4 mt-25 py-8">
      {success ? (
        <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
          <h2 className="text-2xl font-semibold mb-2">Order Successful!</h2>
          <p className="text-lg">
            Thank you for your purchase. Your order has been placed and is being
            processed.
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-[30px] uppercase font-semibold tracking-[0.3px] mb-4">Billing details</h1>
          <form onSubmit={handleOrder} className="space-y-4">
            <div className="w-[50%] grid  gap-4 mb-20">
              <div className="col-span-12">
                <label className="block mb-1 font-medium">First name *</label>
                <input
                  type="text"
                  className="w-full border px-3 py-4 rounded"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-12">
                <label className="block mb-1 font-medium">Last name *</label>
                <input
                  type="text"
                  className="w-full border px-3 py-4 rounded"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-12">
                <label className="block mb-1 font-medium">Country / Region *</label>
                <input
                  type="text"
                  className="w-full border px-3 py-4 rounded"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-12">
                <label className="block mb-1 font-medium">Phone *</label>
                <input
                  type="tel"
                  className="w-full border px-3 py-4 rounded"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-12">
                <label className="block mb-1 font-medium">Email address *</label>
                <input
                  type="email"
                  className="w-full border px-3 py-4 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <h1 className="font-semibold mb-2 text-[30px] tracking-[0.3px] uppercase text-[#1c1c1c]">Your Order</h1>
              <div className="flex justify-between py-9">
                <h4 className="font-semibold text-[17px] text-[#1c1c1c] tracking-[0.3px] uppercase">
                  Product
                </h4>
                <h4 className="font-semibold text-[17px] text-[#1c1c1c] tracking-[0.3px] uppercase pr-50">
                  Subtotal
                </h4>
              </div>
              <ul className="mb-2">
                {cartItems.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex justify-between border-b py-9"
                  >
                    <span className="text-[#565656]">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="pr-58 text-[#565656]">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold flex justify-between py-9">
                <span className="font-semibold text-[17px] text-[#1c1c1c] tracking-[0.3px] uppercase">Subtotal</span>
                <span className="pr-58">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-9">
                <span className="font-semibold text-[17px] text-[#1c1c1c] tracking-[0.3px] uppercase">Discount</span>
                <span className="pr-58">{discount > 0 ? `-$${discount} ` : "$0"}</span>
              </div>
              <div className="font-bold flex justify-between py-9">
                <span className="font-semibold text-[17px] text-[#1c1c1c] tracking-[0.3px] uppercase">Total</span>
                <span className="pr-58">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button
              type="submit"
              className="text-[13px] font-medium uppercase tracking-[1.95px] hover:bg-black hover:text-white duration-400 bg-transparent text-black py-4.5 px-9  border border-black"
            // onClick={handleCheckout}
            >
              {isPending ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
