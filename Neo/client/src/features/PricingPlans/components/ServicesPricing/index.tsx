"use client"
import React from 'react'
import { PricingCard } from "../../common/PricingCard";
import { getAPi } from '@/http/api';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/QueryKeys';

const ServicesPricing = () => {


  const { data, isLoading, isError, error } = useQuery({
    queryKey: QueryKeys.serviceLevels.All,
    queryFn: async () => await getAPi("/service-levels"),
  });

  return (
    <div className='container mx-auto pt-37.5 pb-25 px-7.5 md:px-3 lg:px-0'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5'>
        {data && data?.data?.map((item: any) => (
          <PricingCard
            key={item?._id}
            img={item?.imageUrl}
            name={item?.name}
            price={item?.price}
          />
        ))}
      </div>
    </div>
  )
}

export default ServicesPricing
