"use client";
import { Button } from '@/components/ui/button';
import { QueryKeys } from '@/constants/QueryKeys';
import { getAPi, postApi } from '@/http/api';
import { useCart } from '@/Providers/CartProvider';
import { useQuery } from '@tanstack/react-query';
import { Heart, Minus, Plus, ShoppingBag, Trash, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { text } from 'stream/consumers';

const ProductId = () => {
    const { id } = useParams(); // Dinamik route-dan id alırıq
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("tab1");
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const { addToCart } = useCart();





    type Comment = {
        _id: string;
        user?: { name?: string };
        comment: string;
        rating?: number;
        // Add other fields if needed
    };





    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKeys.products.All, id],
        queryFn: () => getAPi(`/products/${id}`),
        enabled: !!id,
    });

    useEffect(() => {
        if (data?.data?._id) {
            fetchComments();
            fetchProductRating();
        }

    }, [data]);


    const fetchProductRating = async () => {
        try {
            const res = await getAPi(`/comments/rating/${data.data._id}`);
            setAverageRating(res.averageRating);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchComments = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/comments/${data.data._id}`);
            if (!res.ok) throw new Error("Şərhləri gətirmək olmadı");
            const commentsData = await res.json();
            setComments(commentsData);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <img
                className='w-20 h-10'
                src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
                alt="Loading..."
            />
        </div>
    );
    if (error) return <p className="text-red-500 text-3xl text-center">Error loading product</p>;

    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null;


    // 🔥 Quantity state əlavə etdik


    const increaseQty = () => setQuantity((prev) => prev + 1);
    const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));


    const handleAddComment = async () => {
        if (!commentInput.trim()) return;

        try {
            const newComment = await postApi("/comments", {
                product: data.data._id,
                comment: commentInput.trim(),
                rating,
            });

            setComments(prev => [newComment, ...prev]);
            setCommentInput("");
            setRating(0);
            toast.success("Rəy əlavə olundu");
        } catch (error) {
            console.error(error);
            toast.error("Rəy əlavə olunmadı");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            let token;
            if (typeof document !== "undefined") {
                token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];
            }

            await fetch(`http://localhost:3001/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            setComments((prev) => prev.filter((c) => c._id !== commentId));
            toast.success("Rəy silindi");
        } catch (err) {
            console.error(err);
            toast.error("Rəy silinmədi");
        }
    };









    return (
        <div className="container mx-auto mt-32.5 px-10 md:px-5 lg:px-0">
            {data && (
                <div className="grid lg:grid-cols-12 grid-cols-1 gap-10 object-cover" key={data.data._id || data.data.id}>

                    <div className="col-span-7">
                        <img className="w-full object-cover" src={data.data.imageUrl} alt={data.data.name} />
                    </div>


                    <div className="col-span-5">
                        <h1 className="text-[38px] font-semibold uppercase tracking-[0.42px] mb-4">{data.data.name}</h1>
                        <div className="flex items-center gap-1 mb-4">
                            <span className="text-yellow-400 text-[22px]">
                                {"★".repeat(Math.round(averageRating))}
                            </span>
                            <span className="text-gray-300 text-[22px]">
                                {"☆".repeat(5 - Math.round(averageRating))}
                            </span>
                            <span className="ml-2 text-gray-500 text-[18px]">({averageRating})</span>
                        </div>

                        <p className="text-[22px] font-semibold text-black">${data.data.price}.00</p>
                        <p className="text-[16px] text-gray-600 mt-[13px]">
                            Sed viverra tellus in hac. Sagittis vitae et leo duis ut diam quam. Aliquet eget sit amet tellus cras adipiscing enim eu turpis.
                            Orci ac auctor augue mauris augue.
                        </p>
                        <div className="hidden lg:flex items-center gap-6 pr-5 mt-[31px]">
                            <div className="flex items-center gap-5 w-45 border border-gray-100">
                                <button
                                    className="border-none p-5"
                                    aria-label="Decrease quantity"
                                    onClick={decreaseQty}
                                >
                                    <Minus size={17} strokeWidth={1} />
                                </button>
                                <span className="text-lg">{quantity.toString().padStart(2, "0")}</span>
                                <button
                                    className="p-5"
                                    aria-label="Increase quantity"
                                    onClick={increaseQty}
                                >
                                    <Plus size={17} strokeWidth={1} />
                                </button>
                            </div>
                            <button
                                className="flex items-center text-[12px] font-medium tracking-[1.95px] uppercase gap-2 border border-black px-8.5 py-4.5 hover:bg-black hover:text-white transition-colors duration-400"
                                onClick={() => {
                                    if (!user?.name) {
                                        toast.error("Please login to add items to the cart");
                                        return;
                                    }
                                    addToCart({ ...data.data, quantity });
                                    toast.success("Product added to cart");
                                }}
                            >
                                Add to Cart
                                <ShoppingBag size={17} strokeWidth={1} />
                            </button>
                        </div>


                        <div className='pt-[20px] pb-[38px] border-b border-[#eee]'>
                            <button className='flex items-center gap-2'>
                                <Heart size={17} strokeWidth={1} />
                                <span className='text-[13px] text-[#1c1c1c] font-medium uppercase tracking-[1.95px]'>
                                    Add to Wishlist
                                </span>
                            </button>
                        </div>


                        <div className='pt-[40px]'>
                            <div className='flex items-center gap-2 mb-3'>
                                <h5 className='text-[15px] text-[#1c1c1c] font-semibold uppercase'>Color:</h5>
                                <span
                                    className="w-5 h-5 rounded-full"
                                    style={{ backgroundColor: data.data.colors.code }}
                                ></span>
                            </div>
                            <div className='flex items-center gap-2 mb-3'>
                                <h5 className='text-[15px] text-[#1c1c1c] font-semibold uppercase'>Categories:</h5>
                                <p className='text-[16px] text-[#565656]'>{data.data.categories.name}</p>
                            </div>
                            <div className='flex items-center gap-2 mb-3'>
                                <h5 className='text-[15px] text-[#1c1c1c] font-semibold uppercase'>Sizes:</h5>
                                <p className='text-[16px] text-[#565656]'>{data.data.sizes.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-10 md:px-5 lg:px-0 mt-10 md:mt-5 lg:mt-0">
                <div className="flex justify-start lg:justify-center items-start lg:items-center pt-50 pb-30">
                    <div className="bg-white w-full max-w-full ">
                        {/* Tabs */}
                        <div>
                            <div className="flex items-start lg:items-center justify-start lg:justify-center border-b mb-10">
                                <div className="container mx-auto  lg:px-70 grid lg:flex items-start lg:items-center justify-start lg:justify-center">
                                    {["tab1", "tab2", "tab3"].map((tab, i) => {
                                        const labels = ["Description", "Additional information", `Reviews (${comments.length})`];
                                        return (
                                            <button
                                                key={tab}
                                                type="button"
                                                className={`flex-1 py-3 font-semibold text-center text-[17px] uppercase tracking-[0.34px] border-b transition-colors duration-200 ${activeTab === tab
                                                    ? "border-black text-black"
                                                    : " text-gray-500"
                                                    }`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {labels[i]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className=" flex  items-center text-sta lg:text-center">
                            {activeTab === "tab1" && (
                                <p className="text-[17px] text-[#565656]">
                                    Aliquet nec ullamcorper sit amet. Viverra tellus in hac habitasse. Eros in cursus turpis massa tincidunt dui ut ornare. Amet consectetur adipiscing elit ut aliquam. Sit amet nulla facilisi morbi tempus iaculis urna id volutpat. Sed cras ornare arcu dui vivamus arcu felis bibendum. Nunc sed velit dignissim sodales ut eu sem integer. Dictumst quisque sagittis purus sit amet. Suspendisse in est ante in nibh mauris cursus mattis. Quis varius quam quisque id diam vel. A lacus vestibulum sed arcu non. Laoreet non curabitur gravida arcu ac tortor dignissim convallis. Et netus et malesuada fames ac turpis egestas maecenas.
                                </p>
                            )}
                            {activeTab === "tab2" && (
                                <table className="border w-full">
                                    <tbody>
                                        <tr>
                                            <td className="border px-4 py-2 font-semibold text-start uppercase">Weight</td>
                                            <td className="border px-4 py-2 text-start text-[#565656]">0.5 kg</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2 font-semibold text-start uppercase">Dimensions</td>
                                            <td className="border px-4 py-2 text-start text-[#565656]">1 × 2 × 3 cm</td>
                                        </tr>
                                    </tbody>
                                </table>

                            )}
                            {activeTab === "tab3" && (
                                <div className="w-full ">
                                    <h2 className="text-[17px] text-start font-semibold text-[#1c1c1c] tracking-[0.34px] uppercase mb-4 mt-5">Reviews</h2>

                                    {/* Comment siyahısı */}
                                    <div className="mb-15">
                                        {comments.length > 0 ? (
                                            comments.map((c: Comment) => (
                                                <div
                                                    key={c._id}
                                                    className="relative bg-white p-4  lg:w-150  shadow-sm border hover:shadow-md mb-5 transition"
                                                >
                                                    {user && c.user?.name === user.name && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c._id)}
                                                            className="absolute top-3 right-3 text-black hover:text-red-700"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    )}

                                                    <div className="flex gap-3">
                                                        {/* Avatar */}
                                                        <div className="w-12 h-12 text-[20px] flex items-center justify-center rounded-full bg-black text-white font-semibold">
                                                            {c.user?.name ? c.user.name.charAt(0).toUpperCase() : "A"}
                                                        </div>
                                                        {/* Content */}
                                                        <div className="flex flex-col">
                                                            <p className="text-[15px] font-semibold text-gray-800">
                                                                {c.user?.name || "Anonim"}
                                                            </p>
                                                            <div className='text-start'>
                                                                <div className="text-yellow-500 text-sm">
                                                                    {"★".repeat(c.rating || 0) + "☆".repeat(5 - (c.rating || 0))}
                                                                </div>
                                                                <p className="text-gray-600 mt-1">{c.comment}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div>
                                                <p className="text-[#565656] text-start text-[18px]">There are no reviews yet.</p>
                                                {data && (
                                                    <h2 className="text-[17px] text-start font-semibold text-[#1c1c1c] tracking-[0.34px] uppercase mt-10">Be the first to review "{data.data.name}"</h2>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {user ? (
                                        <div className="flex-col gap-2 justify-start items-start ">
                                            <p className='text-[#565656] text-start text-[18px]'>Your Rating *</p>
                                            <div className="flex mb-6">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className={`text-xl  ${rating >= star ? "text-yellow-400" : "text-gray-200"}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>

                                            <input
                                                type="text"
                                                value={commentInput}
                                                onChange={(e) => setCommentInput(e.target.value)}
                                                placeholder="Your Review"
                                                className="border px-5 pt-5 pb-50 flex-1 w-full focus:outline-none"
                                            />
                                            <div className='text-start mt-4'>
                                                <button
                                                    onClick={handleAddComment}
                                                    className=" text-[13px] tracking-[1.95px] bg-transparent uppercase font-medium text-black hover:bg-black hover:text-white duration-400 border border-black py-3.5 px-10"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[18px] mt-20 text-gray-500">Please log in to leave a review.</p>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductId;
