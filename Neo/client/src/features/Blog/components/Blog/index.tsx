"use client";
import React from 'react'
import BlogCard from '../../common/BlogCard'
import Link from 'next/link'
import { LinkIcon, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/QueryKeys';
import { getAPi } from '@/http/api';

const Blog = () => {


    const { data, isLoading, isError, error } = useQuery({
        queryKey: QueryKeys.blogs.All,
        queryFn: async () => await getAPi("/blogs"),
    });

    return (
        <div>
            <div className='py-9 bg-[#f9f9f9] '>
                <div className='container mx-auto px-7.5 md:px-3 lg:px-0'>
                    <h1 className='text-[40px] uppercase font-semibold tracking-[1px]'>Blog no sidebar</h1>
                    <div className='text-[15px] text-[#606060] mb-6 flex items-center gap-2'>
                        <li className='list-none'><Link href="/" className="text-[#565656] hover:text-black transition mb-3.5 text-[15px] relative group cursor-pointer ">Home
                            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black transition-all duration-400 group-hover:w-full"></span>
                        </Link>
                        </li>
                        /
                        <div><Link href="/blog">Blog no sidebar</Link></div>
                    </div>
                </div>

            </div>
            <div className='container mx-auto mt-35'>
               {data && 
                data?.data?.slice(0, 2).map((blog: any) => (
                    <BlogCard
                        key={blog?._id}
                        title={blog?.title}
                        date={blog?.date}
                        image={blog?.imageUrl}
                        id={blog?._id}
                    />
                    ))}
                
                <div className='py-32.5 px-17.5 bg-[#f9f9f9] flex flex-col items-center text-center mb-25'>
                    <LinkIcon size={40} />
                    <h3 className='text-[22px] font-semibold text-[#1c1c1c] tracking-[0.22px] uppercase mt-7'>Pharetra magna ac placerat sed bulum lectus. A iaculis at erat pellentesque in adipiscing donne.</h3>

                </div>
                {data &&
                data?.data?.slice(2).map((blog: any) => (
                    <BlogCard
                        key={blog?._id}
                        title={blog?.title}
                        date={blog?.date}
                        image={blog?.imageUrl}
                        id={blog?._id}
                    />
                ))}
                <div className='py-32.5 px-17.5 bg-[#f9f9f9] flex flex-col items-center text-center mb-25'>
                    <MessageCircle size={40} strokeWidth={1.5} />
                    <h3 className='text-[22px] font-semibold text-[#1c1c1c] tracking-[0.22px] uppercase mt-7'>Enim sed faucibus turpis in eu. Montes nasceturs ridiculus mus mauris. Sit amet nisl purus mollis.</h3>
                    <p className='text-[16px] text-[#565656] mt-4'>Kiya Montaya</p>

                </div>
            </div>

        </div>
    )
}

export default Blog
