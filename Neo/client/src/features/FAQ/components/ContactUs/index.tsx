import React from 'react'

const ContactUs = () => {
  return (
    <div className='px-7.5 md:px-3 lg:px-0'>
      <div className='container mx-auto pb-32.5 pt-20 flex flex-col justify-center items-center'>
        <img className='w-[1120px] object-cover' src="https://neoocular.qodeinteractive.com/wp-content/uploads/2021/09/about-us-img-01.jpg" alt="" />
        <div className='pt-13 flex flex-col justify-center items-center text-center'>
            <h1 className='text-[30px] font-semibold tracking-[0.3px] uppercase'>If you cannot find the answer to your <br /> question, please contact us</h1>
            <p className='text-[16px] text-[#565656] mt-4'>Diam volutpat commodo sed egestas egestas fringilla phasellus. Augue eget arcu dictum varius <br /> duis at euismod do lorem. Mauris nunc congue nisi vitae purus in</p>
            <button className='mt-8 px-17.5 py-4 bg-transparent hover:bg-black hover:text-white duration-300 text-[13px] text-black border border-black font-medium uppercase tracking-[.15rem]'>Contact Us</button>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
