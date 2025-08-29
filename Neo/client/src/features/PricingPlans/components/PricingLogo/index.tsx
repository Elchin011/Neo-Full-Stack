import React from 'react'

const PricingLogo = () => {


    const PricingLogo = [
        {
            id: 1,
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Client-01-1.png"
        },
        {
            id: 2,
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Client-02-1.png"
        },
        {
            id: 3,
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Client-03-1.png"
        },
        {
            id: 4,
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Client-04-1.png"
        },
        {
            id: 5,
            img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Client-05-1.png"
        }
    ]

  return (
    <div>
        <div className='py-19 bg-[#f9f9f9]'>
            <div className='container mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7.5'>
                    {
                        PricingLogo.map((item:any) => (
                            <div key={item.id} className='flex items-center justify-center'>
                                <img className='object-contain' src={item.img} alt="" />
                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
      
    </div>
  )
}

export default PricingLogo
