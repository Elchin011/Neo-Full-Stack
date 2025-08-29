import React from 'react'
import { ContactCard } from '../../common/ContactCard'

const Contact = () => {
  const ContactData = [
    {
      img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Contact-us-single-img-01.jpg",
      name: "Optical shop",
      adress: "34 88th St, Flushing, NY 11372",
      mail: "mail: neoocular1@qodeinetractive.com",
      phone: "tel: (+971) 204 2033 6611"
    },
    {
      img: "	https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Contact-us-single-img-02.jpg",
      name: "Our Clinic Shop",
      adress: "235 N Edison St, Arlington, VA 22203",
      mail: "mail: neoocular2@qodeinetractive.com",
      phone: "tel: (+971) 204 2033 6611"
    },
    {
      img: "https://neoocular.qodeinteractive.com/wp-content/uploads/2021/07/Contact-us-single-img-03.jpg",
      name: "our clinic",
      adress: "1705-1799 D Ave, Baltimore, MD 21213",
      mail: "mail: neoocular3@qodeinetractive.com",
      phone: "tel: (+971) 204 2033 6611"
    }
  ];
  return (
    <div>
      <div className='container mx-auto pt-37.5 pb-25 px-7.5 md:px-3 lg:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5'>
          {ContactData.map((item, idx) => (
            <ContactCard
              key={idx}
              img={item.img}
              name={item.name}
              adress={item.adress}
              mail={item.mail}
              phone={item.phone}
            />
          ))}
        </div>
      </div>

      <div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.3578511541455!2d-77.12323722378885!3d38.87005377172982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b4140e4c35a3%3A0x232b660d33709f4a!2zMjM1IE4gRWRpc29uIFN0LCBBcmxpbmd0b24sIFZBIDIyMjAzLCBBbWVyaWthIEJpcmzJmcWfbWnFnyDFnnRhdGxhcsSx!5e0!3m2!1saz!2saz!4v1756287129519!5m2!1saz!2saz"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </div>


    </div>
  )
}

export default Contact
