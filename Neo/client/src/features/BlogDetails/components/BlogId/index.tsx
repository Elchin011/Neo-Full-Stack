"use client";
import { QueryKeys } from '@/constants/QueryKeys';
import { getAPi } from '@/http/api';
import { useQuery } from '@tanstack/react-query';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'


const BlogId = () => {


    const { id } = useParams(); // Dinamik route-dan id alırıq

    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKeys.blogs.All, id],
        queryFn: () => getAPi(`/blog/${id}`),
        enabled: !!id,
    });


    if (isLoading) return <div className="flex justify-center items-center h-screen">
        <img className='w-20 h-10' src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif" alt="Loading..." />
    </div>;
    if (error) return <p className="text-red-500 text-3xl text-center">Error loading product</p>;

    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null;




    const categoryData = [
        { name: "Color (3)" },
        { name: "Frame (10)" },
        { name: "Optic (9)" },
        { name: "Shape (2)" },
        { name: "Style (3)" },
        { name: "Vision (4)" }
    ]

    const latestData = [
        {
            name: "Oct 7, Color",
            title: "Girl cheek trend",
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/h1-b-list-img-3-150x150.jpg"
        },
        {
            name: "Oct 5, Frame",
            title: "This year frames",
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/h1-b-list-img-2-150x150.jpg"
        },
        {
            name: "Oct 1, Vision",
            title: "Trendy 21 shapes",
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/h1-b-list-img-1-150x150.jpg"
        },

    ]
    const tagsData = [
        { name: "Brands (17)" },
        { name: "Design (14)" },
        { name: "Glasses (3)" },
        { name: "Sight (11)" },
        { name: "Trends (17)" },
        { name: "Vibrant (6)" }
    ]

    return (
        <div className="container mx-auto mt-32.5">
            {
                data && (
                    <div className="grid grid-cols-2 lg:grid-cols-12 gap-15.5 object-cover" key={data.data._id || data.data.id}>
                        <div className="lg:col-span-9 col-span-12">
                            <div className='px-7.5 md:px-3 lg:px-0'>
                                <img className="lg:w-full w-[290px]  object-cover" src={data.data.imageUrl} alt={data.data.name} />
                            </div>
                            <div className='mt-14 text-center w-[360px] px-7.5 md:px-3 lg:px-0 lg:w-full'>
                                <p className='text-[12px] text-[#606060] tracking-[1.32px] uppercase font-medium'>{data.data.date}</p>
                                <h1 className='text-[40px] font-semibold tracking-[1px] uppercase mt-[9px]'>{data.data.title}</h1>
                                <div className='flex flex-col gap-2.5 lg:px-12 mt-[9px]'>
                                    <p className='text-[16px] text-[#565656] text-start' >Convallis convallis tellus id interdum velit laoreet id. Aenean pharetra magna ac placerat. In metus vulputate eu felis scelerisque. Tempor don a lacus commodo ullamcorper. Odio ut sem nulla pharetra diam. Praesent donne sed elementum facilisis leo vel fringilla est ullamcorper eget nulla. Ultricies integer quis auctor elit sed vulput nun. In dictum varius duis at consecet ur lor.</p>
                                    <p className='text-[16px] text-[#565656] text-start'>Elit pellentesque habitant morbi tristique senectus et. Cursus risus at ultrices mi tempus imperdiet malesuad pellentesque. Dolor sit amet elit consectetur adipiscing. Pretium quam vulputate dignissim suspendisse. Arcu cursus vitae congue mauris rhoncus vel aenean elit. Donne urna fermentum posuere nec tincidunt praesent in semper feugiat. Fermentum odio eu feugiat pretium nibh ipsum consequat. Gravida quis sed blandit turpis risus cursus .Tristique senectus et netus et malesuada fames ac turpis sed. At auctor urna nunc id.</p>
                                    <div className='py-[9px] pl-6.5 border-l border-black text-start mt-2.5'>
                                        <p className='text-[15px] font-semibold text-[#1c1c1c] tracking-[0.3px] uppercase'>At elementum eu facilisis sed odio morbi commodo quis. Volutpat sed cras ornare do arcu dui vivamus arc ismod quis viverra nibh cras pulvi in.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-12 gap-5 h-[406px] pt-6'>
                                <div className='lg:col-span-3 col-span-12 px-7.5 md:px-3 lg:px-0'>
                                    <img className='lg:h-full w-[290px] lg:w-full object-cover' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/b-single-img-2.jpg" alt="" />
                                </div> 
                                <div className='lg:col-span-9 col-span-12 px-7.5 md:px-3 lg:px-0'>
                                    <img className='lg:h-full w-[290px] lg:w-full object-cover' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/b-single-img-03.jpg" alt="" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-7.5 px-7.5 lg:px-12 lg:mt-[41px] mt-[250px] '>
                                <div className='w-[290px] lg:w-full '>
                                    <p>Enim neque volutpat ac tincidunt vitae semper. Ultrices dui sapien eget mi. Risus at ultrices mi tempus eges imperdiet nulla malesuada. Magna fringilla urna porttitor rhoncus dolor purus non enim. Eu volutpat odio amet facilisis mauris sit amet. Feugiat vivamus at augue eget arcu dictum varius duis at. Nullam eget felis eget nunc lobortis. Elit ut aliquam purus sit amet luctus. Massa sed elementum tempus egestas sed. Egestas fringilla do phasellus faucibus scelerisque eleifend donec pretium vulputate varius morbi enim nunc faucibus.</p>
                                </div>
                                <div className='w-[290px] lg:w-full'>
                                    <h2 className='text-[36px] font-semibold tracking-[0.34px] uppercase'>Handcrafted with purpose</h2>
                                    <h6 className='text-[19px] font-light'>Vitae justo eget magna do fermentum iaculis eu</h6>
                                    <div className='flex flex-col gap-2.5 mt-2.5 text-[16px] text-[#565656]'>
                                        <p>Pharetra et ultrices neque ornare aenean euismod elementum nisi. Ipsum nunc aliquet bibendum enim facilisis. At quis risus sed vulputate odio ut enim blandit. Mauris sit amet massa vitae tortor lacini condimentum quis. Est ullamcorper eget nulla facilisi etiam dignissim diam quis. Dolor sed viverra ipsum nunc. Egestas egestas fringilla phasellus faucibus sce leriquene in ele.</p>
                                        <p> Integer enim neque volutpat ac tincidunt vitae semper quis. Viverra scelerisque mauris in aliquam sem. Non nisi est sit amet. Hac habitasse platea dictumst quisque sagittis purus sit. Facilisis volutpat est velit egestas dui id. Euismod lacinia at quis risus sed vulputate. Turpis in eu mi bibendum neque egestas in.</p>
                                        <p>Sapien et ligula ullamcorper malesuada proin libero nunc. Accumsan in nisi scelerisque nisl eu ultrices vitae auctor. Eu scelerisque felis proin imperdiet. Eu consequat ac felis donec et. Euismod elementum nisi quis eleifend. Sit amet consectetur adipiscing elit. Ut porttitor leo a diam sollicitudin tempor id eu nisl. Tellus cras adipiscing enim eu turpis egestas. Ornare lectus sit amet est placerat in egestas erat. Cursus turpis tincidunt dui massa ut ornare lectus. Amet massa vitae tortor condimentum lacinia id cursus.</p>
                                    </div>
                                </div>
                                <div className='w-[290px] lg:w-full'>
                                    <h2 className='text-[30px] font-semibold tracking-[0.34px] uppercase'>Why are sunglasses useful?</h2>
                                    <h6 className='text-[19px] font-light'>Vestibulum lectus mauris ultrices eros curs</h6>
                                    <div className='flex flex-col gap-2.5 mt-2.5 text-[16px] text-[#565656]'>
                                        <p>Commodo nulla facilisi nullam vehicula ipsum a arcu cursus. Sit amet volutpat consequat mauris nunc congue nisi vitae. Faucibus purus in massa tempor nec feugiat nisl. Aliquam sem fringilla ut morbi tincidunt. A diam sollicitudin tempor id eu nisl nunc. Nisl vel pretium lectus quam id leo in vitae. Semper auctor neque vitae tempus quam pellentesque nec. Neque volutpat ac tincidunt vitae semper quis lectus. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat. Ut lectus arcu bibendum at varius vel pharetra vel. Vel fringilla est ullamcorper eget nulla. Mattis pellentesque id nibh tortor id aliquet lectus proin nibh nec ullamcorper sit.</p>
                                        <p>Sapien et ligula ullamcorper malesuada proin libero nunc. Accumsan in nisi scelerisque nisl eu ultrices vitae auctor. Eu scelerisque felis proin imperdiet. Eu consequat ac felis donec et. Euismod elementum nisi quis eleifend. Sit amet consectetur adipiscing elit. Ut porttitor leo a diam sollicitudin tempor id eu nisl. Tellus cras adipiscing enim eu turpis egestas. Ornare lectus sit amet est placerat in egestas erat. Cursus turpis tincidunt dui massa ut ornare lectus. Amet massa vitae tortor condimentum lacinia id cursus.</p>
                                    </div>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="lg:col-span-3 col-span-12 w-full">
                            <div className="flex flex-col gap-7">
                                <div>
                                    <h3 className='text-[17px] font-semibold tracking-[0.34px] uppercase'>Category</h3>
                                    <div className='flex flex-col gap-3 mt-5'>
                                        {categoryData.map((category, index) => (
                                            <p key={index} className='text-[12px] text-[#606060] tracking-[1.32px] uppercase font-medium'>{category.name}</p>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-[17px] font-semibold tracking-[0.34px] uppercase'>Latest Posts</h3>
                                    <div className='flex flex-col gap-6 mt-5  md:px-3 lg:px-0'>
                                        {latestData.map((item, idx) => (
                                            <div className='lg:flex flex-col gap-4 mb-5 md:mb-0 lg:mb-0' key={idx}>
                                                <img className='lg:w-19 w-[290px] object-contain' src={item.img} alt={item.title} />
                                                <div>
                                                    <p className='text-[12px] text-[#606060] tracking-[1.32px] uppercase font-medium'>{item.name}</p>
                                                    <h5 className='text-[15px] font-semibold tracking-[0.34px] uppercase mt-1'>{item.title}</h5>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-[17px] font-semibold tracking-[0.34px] uppercase'>Tags</h3>
                                    <div className='flex flex-col gap-2.5 mt-5'>
                                        {tagsData.map((tag, index) => (
                                            <p key={index} className='text-[16px] text-[#565656] tracking-[0.16px]'>{tag.name}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='mt-[54px]'>
                                <h3 className='text-[17px] font-semibold tracking-[0.34px] uppercase mb-16'>Instagram</h3>
                                <input type="text" className='pl-[22px] py-[15px] border border-[#eee] lg:w-full' placeholder='Search'/>
                                <button className='bg-black py-[14px] px-[38px] text-white text-[13px] uppercase tracking-[1.95px] mt-2.5'>Search</button>
                            </div>
                            <div className='mt-[54px]'>
                                <h3 className='text-[17px] font-semibold tracking-[0.34px] uppercase mb-8'>Follow Us</h3>
                                <div className='flex gap-4 items-center'>
                                    <Facebook size={18} fill='black' strokeWidth={1.5} />
                                    <Twitter size={18} fill='black' strokeWidth={1.5} />
                                    <Instagram size={18} strokeWidth={1.5} />
                                    <Linkedin size={18} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default BlogId;
