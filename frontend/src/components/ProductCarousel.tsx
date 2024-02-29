import React from 'react'
import { useGetTopProductsQuery } from '../slices/productApiSlice'
import Loader from './Loader'
import Message from './Message'
import { Carousel, Image } from 'react-bootstrap'

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery()

  if (isLoading) {
    return <Loader />
  } else if (error) {
    // @ts-ignore
    return <Message variant='danger'>{error?.data?.message || error.error}</Message>
  }

  return (
    <Carousel pause='hover' className='bg-white mb-4'>
      {products?.map(product => (
        <Carousel.Item key={product._id} className='text-center'>
          <Image
            src={product.image}
            alt={product.name}
            fluid
          />
          <Carousel.Caption>
            <h2>{product.name} (${product.price})</h2>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel