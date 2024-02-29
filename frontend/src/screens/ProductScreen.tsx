import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import Rating from "../components/Rating"
import Loader from "../components/Loader"
import { useCreateReviewMutation, useGetProductByIdQuery } from "../slices/productApiSlice"
import Message from "../components/Message"
import React, { useEffect } from "react"
import { useState } from "react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../slices/cartSlice"
import { RootState } from "../store"
import { toast } from "react-toastify"
import Meta from "../components/Meta"

const ProductScreen = () => {
  const { id: productId } = useParams() as { id: string }
  const [qty, setqty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId)
  const [createReview, { isLoading: loadingReview, error: errorReview }] = useCreateReviewMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const addToCartHandler = () => {
    if (product === undefined) return
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  const reviewSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (product === undefined) return
    try {
      await createReview({ productId: product._id, rating, comment }).unwrap()
      refetch()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (errorReview && 'data' in errorReview) {
      const { data } = errorReview as { data: { message: string } }
      toast.error(data?.message)
    }
  }, [errorReview])

  return (
    <>
      {isLoading ? (<Loader />)
        : error ? (<Message variant='danger'>{(error as SerializedError)?.message}</Message>)
          : product === undefined ? (<Message variant='danger'>Product not found</Message>)
            : (<>
              <Meta title={product.name} description={product.description} />
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
              <Row className='review'>
                <Col md={6}>
                  <h2>Reviews</h2>
                  {product.reviews.length === 0 && <Message>No Reviews</Message>}
                  <ListGroup variant='flush'>
                    {product.reviews.map(review => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.user.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      <h2>Write a Customer Review</h2>
                      {loadingReview && <Loader />}
                      {userInfo ? (
                        <Form onSubmit={reviewSubmitHandler}>
                          <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as='select' value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                              <option value=''>Select...</option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 - Very Good</option>
                              <option value='5'>5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId='comment'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as='textarea' rows={3} value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                          </Form.Group>
                          <Button type='submit' variant='primary'>Submit</Button>
                        </Form>
                      ) : (
                        <Message>Please <Link to='/login'>sign in</Link> to write a review</Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </>
            )}
    </>
  )
}

export default ProductScreen