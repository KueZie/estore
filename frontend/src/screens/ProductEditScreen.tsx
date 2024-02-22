import React, { useEffect, useState } from 'react'
import { FormContainer } from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetProductByIdQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../slices/productApiSlice'
import { Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {
  const { id } = useParams() as { id: string }
  const [updateProduct, { isLoading: loadingUpdate, error: errorUpdate }] = useUpdateProductMutation()
  const [uploadProductImage, { isLoading: loadingUpload, error: errorUpload }] = useUploadProductImageMutation()
  const { data: productDetails, isLoading, error } = useGetProductByIdQuery(id)

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  useEffect(() => {
    setName(productDetails?.name || '')
    setPrice(productDetails?.price || 0)
    setImage(productDetails?.image || '')
    setBrand(productDetails?.brand || '')
    setCategory(productDetails?.category || '')
    setCountInStock(productDetails?.countInStock || 0)
    setDescription(productDetails?.description || '')
  }, [productDetails])


  const navigate = useNavigate()

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateProduct({ _id: id, name, price, image, brand, category, countInStock, description })
    toast.success('Product updated')
    navigate('/admin/productlist')
  }

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData()
      formData.append('image', e.target.files[0])
      try {
        const result = await uploadProductImage(formData).unwrap()
        setImage(result.imagePath)
        toast.success('Image uploaded')
      } catch (error) {
        toast.error('Image upload failed')
        console.log(error)
      }
    }
  }

  return (
    <>
      <div>ProductEditScreen</div>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate ? <Loader /> :
          errorUpdate ? <Message variant='danger'>{errorUpdate}</Message> : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='float'
                  placeholder='Enter price'
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Group controlId='image'>
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter image url'
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                  <Form.Control
                    type='file'
                    placeholder='Choose File'
                    onChange={uploadFileHandler}
                  ></Form.Control>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId='brand'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='countInStock'>
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter countInStock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(parseInt(e.target.value))}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <button type='submit' className='btn btn-primary'>
                Update
              </button>
            </Form>
          )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen