import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { SerializedError } from '@reduxjs/toolkit'
import React from 'react'
import { useParams } from 'react-router-dom'
import ProductPaginate from '../components/ProductPaginate'
import SearchBox from '../components/SearchBox'


const HomeScreen = () => {
  const { pageNumber, keyword } = useParams()
  const { data: pagination, isLoading, error, refetch } = useGetProductsQuery({ pageNumber: parseInt(pageNumber || '1'), keyword })

  if (pagination && pageNumber && parseInt(pageNumber) > pagination.pages) {
    return <Message variant='danger'>Page not found</Message>
  }

  return (
    <>
      { isLoading ? (<Loader />)
        : error ? (<Message variant='danger'>
            {'error' in error ? error.error : (error as SerializedError)?.message}
          </Message>)
          : pagination?.products === undefined ? (<Message variant='danger'>No products found</Message>)
          : (<>
        
        <Row>
          <Col><h1>Latest Products</h1></Col>
          <Col><SearchBox /></Col>
        </Row>
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