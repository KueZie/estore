import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { SerializedError } from '@reduxjs/toolkit'
import React from 'react'


const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery()

  return (
    <>
      { isLoading ? (<Loader />)
        : error ? (<Message variant='danger'>
            {'error' in error ? error.error : (error as SerializedError)?.message}
          </Message>)
          : products === undefined ? (<Message variant='danger'>No products found</Message>)
          : (<>
        <h1>Latest Products</h1>
        <Row>
          {products.map(product => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <Product product={product} key={product._id}/>
            </Col>
          ))}
        </Row>
      </>) }
    </>
  )
}

export default HomeScreen