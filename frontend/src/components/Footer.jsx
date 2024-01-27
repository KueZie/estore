import { Container, Row, Col } from 'react-bootstrap'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            eCommerce &copy; {currentYear}
          </Col>
        </Row>
      </Container>
    </footer>
  )
}


export default Footer