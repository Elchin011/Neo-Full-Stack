"use client";
import { Button } from '@/components/ui/button';
import { QueryKeys } from '@/constants/QueryKeys';
import { getAPi, postApi } from '@/http/api';
import { useCart } from '@/Providers/CartProvider';
import { useQuery } from '@tanstack/react-query';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
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
    const [localUser, setLocalUser] = useState<User | null>(null);
    const { addToCart } = useCart();





    type User = {
        name: string;
    };

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
        if (data?.data?._id) fetchComments();
    }, [data]);


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


    const displayUser = localUser || user;
    if (!displayUser || !displayUser.name) return null;


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
            await fetch(`http://localhost:3001/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // əgər auth token istifadə edirsənsə
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
                                <h5 className='text-[15px] text-[#1c1c1c] font-semibold uppercase'>Sku:</h5>
                                <p className='text-[16px] text-[#565656]'>0011</p>
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
                <div className="flex justify-start lg:justify-center items-start lg:items-center min-h-screen">
                    <div className="bg-white w-full max-w-full ">
                        {/* Tabs */}
                        <div>
                            <div className="flex items-start lg:items-center justify-start lg:justify-center border-b mb-10">
                                <div className="container mx-auto  lg:px-70 grid lg:flex items-start lg:items-center justify-start lg:justify-center">
                                    {["tab1", "tab2", "tab3"].map((tab, i) => {
                                        const labels = ["Description", "Additional information", "Reviews(0)"];
                                        return (
                                            <button
                                                key={tab}
                                                type="button"
                                                className={`flex-1 py-3 font-semibold text-center border-b transition-colors duration-200 ${activeTab === tab
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
                        <div className=" flex justify-center items-center text-sta lg:text-center">
                            {activeTab === "tab1" && (
                                <p className="text-[16px] text-[#565656]">
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
                                    <h2 className="text-xl font-semibold mb-4">Rəylər</h2>

                                    {/* Comment siyahısı */}
                                    <div className="space-y-4 mb-6">
                                        {comments.length > 0 ? (
                                            comments.map((c: Comment) => (
                                                <div key={c._id} className="border-b pb-2 flex-col items-start gap-2">
                                                    <div className='flex items-center gap-2'>
                                                        <Button className="w-[28px] h-[28px] text-[12px] rounded-full">
                                                            {c.user?.name ? c.user.name.charAt(0) : "A"} {/* comment yazan userin ilk hərfi */}
                                                        </Button>
                                                        <p className="text-sm font-medium">{c.user?.name || "Anonim"}</p>
                                                        {user && c.user?.name === user.name && (
                                                            <button
                                                                onClick={() => handleDeleteComment(c._id)}
                                                                className="ml-2 text-xs text-red-500 hover:underline"
                                                            >
                                                                Sil
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className='flex flex-col items-start'>
                                                        <div className="text-yellow-400">
                                                            {"★".repeat(c.rating || 0) + "☆".repeat(5 - (c.rating || 0))}
                                                        </div>
                                                        <p className="text-gray-700">{c.comment}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Bu məhsul üçün hələ rəy yoxdur.</p>
                                        )}

                                    </div>

                                    {/* Yeni comment form */}
                                    {user ? (
                                        <div className="flex gap-2">
                                            <div className="flex gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={commentInput}
                                                onChange={(e) => setCommentInput(e.target.value)}
                                                placeholder="Rəyinizi yazın..."
                                                className="border p-2 flex-1 rounded"
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                className="bg-black text-white px-4 rounded"
                                            >
                                                Göndər
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Rəy yazmaq üçün giriş edin.</p>
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
