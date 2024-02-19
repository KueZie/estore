import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import Rating from "../components/Rating"
import Loader from "../components/Loader"
import { useGetProductByIdQuery } from "../slices/productApiSlice"
import Message from "../components/Message"
import React from "react"
import { useState } from "react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { addToCart } from "../slices/cartSlice"

const ProductScreen = () => {
  const { id: productId } = useParams() as { id: string }
  const [qty, setqty] = useState(1)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId)

  const addToCartHandler = () => {
    if (product === undefined) return
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  return (
    <>
      { isLoading ? (<Loader />)
          : error ? (<Message variant='danger'>{(error as SerializedError)?.message}</Message>)
          : product === undefined ? (<Message variant='danger'>Product not found</Message>)
          : (<>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>{product.name}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </ListGroup.Item>
            <ListGroup.Item>
              Price: ${product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>
                    Price:
                  </Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    Status:
                  </Col>
                  <Col>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity:</Col>
                    <Col>
                      <Form.Control as='select' value={qty} onChange={(e) => setqty(Number(e.target.value))}>
                        {[...Array(product.countInStock).keys()].map(x => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
                )}
              <ListGroup.Item>
                <Button className='btn-block' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )}
    </>
  )
}

export default ProductScreen