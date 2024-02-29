import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { SerializedError } from '@reduxjs/toolkit'
import React from 'react'
import { useParams } from 'react-router-dom'
import ProductPaginate from '../components/ProductPaginate'


const HomeScreen = () => {
  const { pageNumber } = useParams()
  const { data: pagination, isLoading, error, refetch } = useGetProductsQuery({ pageNumber: parseInt(pageNumber || '1') })


  console.log('pagination', pagination)

  return (
    <>
      { isLoading ? (<Loader />)
        : error ? (<Message variant='danger'>
            {'error' in error ? error.error : (error as SerializedError)?.message}
          </Message>)
          : pagination?.products === undefined ? (<Message variant='danger'>No products found</Message>)
          : (<>
        <h1>Latest Products</h1>
        <Row>
          {pagination?.products.map(product => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <Product product={product} key={product._id}/>
            </Col>
          ))}
        </Row>
        <Row>
          <Col className='d-flex justify-content-center'>
            <ProductPaginate pages={pagination.pages} page={pagination.page} keyword='' />
          </Col>
        </Row>
      </>) }
    </>
  )
}

export default HomeScreen