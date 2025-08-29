import Link from 'next/link';
import React from 'react'

const BlogCard = ({ 
  title, 
  date, 
  image, 
  id
 }: { 
  title: string; 
  date: string; 
  image: any; 
  id: any 
}) => {



  return (
    <div className='overflow-hidden'>
     <div className='px-7.5 md:px-3 lg:px-0'>
          <div className='overflow-hidden'>
            <img className='w-full h-[400px] lg:h-[1210px] object-cover hover:scale-102 transition-transform duration-500'  src={image} alt="" />
          </div>
          <div className='text-center mt-[30px]'>
            <p className='text-[#606060] text-[12px] font-semibold uppercase tracking-[1px] mb-2.5'>{date}</p>
            <h2 className='text-[36px] font-semibold uppercase'>
              <Link href={`/blog/${id}`}>{title}</Link>
            </h2>
            <p className='mt-2.5 text-[#565656] text-[16px]'>Convallis convallis tellus id interdum velit laoreet id. Aenean pharetra magna ac placerat. In metus vulputate eu felis scelerisque. Tempor don a lacus commodo ullamcorper. Odio ut tortor at auctor urna nunc id. Dignissim cras tincidunt lobortis feugiat vivamus at augue. Nisl tincidunt eget nullam non nisi est sit. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Interdum velit euismod in pellentesque massa in uspendisse sed in do. Duis at consectetur lorem donec massa sapien faucibus. Ac placerat lectus vestibulum mauris ultrices. Risus pretium quam vulputate dignissim diam enim.</p>
            <button className='mt-6 py-1 border-b border-black text-[13px] font-medium uppercase tracking-[1px] mb-32'>Read More</button>
          </div>
        </div>
      </div>
  )
}

export default BlogCard
