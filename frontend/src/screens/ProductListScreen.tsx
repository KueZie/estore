import React from 'react'
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation

} from '../slices/productApiSlice'
import Loader from '../components/Loader'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import ProductPaginate from '../components/ProductPaginate'

export const ProductListScreen = () => {
  const { pageNumber } = useParams()

  const { data: pagination, isLoading, error, refetch } = useGetProductsQuery({ pageNumber: parseInt(pageNumber || '1') })

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      await deleteProduct(id).unwrap()
      refetch()
      toast.success('Product deleted')
    }
  }

  return (
    <>
      <Row>
        <Col>
          <h2>ProductListScreen</h2>
        </Col>
        <Col className='text-end'>
          <LinkContainer to='/admin/product/create'>
            <Button className='my-3'>
              Create Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <th>ID</th>
          <th>NAME</th>
          <th>PRICE</th>
          <th>CATEGORY</th>
          <th>BRAND</th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <tr>
              <td>{error.toString()}</td>
            </tr>
          ) : (
            pagination?.products?.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id.toString()}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                </td>
                <td>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {pagination && (
        <ProductPaginate 
          pages={pagination.pages}
          page={pagination.page}
          redirectBaseUrl='/admin/productlist/page/'
        />
      )}
    </>
  )
}
