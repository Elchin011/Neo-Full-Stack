import { Button } from '@/components/ui/button'
import React from 'react'

const TheBest = () => {
    return (
        <div className='container mx-auto pt-37.5 px-7.5 md:px-3 lg:px-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5 items-center justify-center'>
                <div className='overflow-hidden'>
                    <img className='object-cover hover:scale-102 transition-transform duration-500' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/08/voucher-01-img.jpg" alt="" />
                </div>
                <div className='overflow-hidden'>
                    <img className='object-cover hover:scale-102 transition-transform duration-500' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/08/voucher-img-02.jpg" alt="" />
                </div>
                <div className='overflow-hidden'>
                    <img className='object-cover hover:scale-102 transition-transform duration-500' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/08/voucher-img-03.jpg" alt="" />
                </div>

            </div>
            <div className='py-20.5 flex flex-col justify-center items-center'>
                <h2 className='text-4xl uppercase font-semibold'>The best offers for you</h2>
                <p className='text-center text-[16px] text-[#565656] mt-4.5'>Diam volutpat commodo sed egestas egestas fringilla phasellus. Augue eget arcu dictum varius <br /> duis at euismod do lorem. Mauris nunc congue nisi vitae. Purus in mollis nunc sed. Eu mi <br /> bibendum neque egestas quisque egestas diam in neque convallis.</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7.5 lg:gap-18 justify-center items-center'>
                <div className='relative text-white'>
                    <img className='h-[300px] lg:h-[500px] object-cover' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/10/inner-vouchers-img-1.jpg" alt="" />
                    <div className='absolute bottom-20 left-20'>
                        <h2 className='lg:text-[100px] text-[40px] font-thin tracking-[1px] uppercase lg:leading-20'>Sale <br /> <span className='font-medium'>70%</span> </h2>
                        <p className='text-[19px] font-light mt-4.5'>Sale up to 70% on new items</p>
                        <Button className='bg-transparent text-white border border-white hover:bg-[#1c1c1c] hover:border-[#1c1c1c] duration-300 uppercase text-[13px] font-medium px-3 py-1 lg:px-13 lg:py-3.5 mt-4.5'>Shop now</Button>
                    </div>
                </div>
                <div className='relative text-white'>
                    <img className='h-[300px] lg:h-[500px] object-cover' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/10/inner-vouchers-img-2.jpg" alt="" />
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                        <h2 className='lg:text-[100px] text-[40px] font-thin tracking-[1px] uppercase lg:leading-20'>Virtual <br /> <span className='font-medium'>Try-On</span> </h2>
                        <p className='text-[19px] font-light mt-4.5'>Sale up to 70% on new items</p>
                        <Button className='bg-transparent text-white border border-white hover:bg-[#1c1c1c] hover:border-[#1c1c1c] duration-300 uppercase text-[13px] font-medium px-3 py-1 lg:px-13 lg:py-3.5 mt-4.5'>Shop now</Button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default TheBest 
