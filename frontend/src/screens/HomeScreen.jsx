import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productSlice'
import Loader from '../components/Loader'


const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery()

  return (
    <>
      { isLoading ? (<Loader />)
        : error ? (<h3>{error?.data?.message || error.error}</h3>)
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