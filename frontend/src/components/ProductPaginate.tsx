import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface ProductPaginateProps {
  pages: number;
  page: number;
  keyword?: string;
  isAdmin?: boolean;
  redirectBaseUrl?: string;
}

const ProductPaginate = (props: ProductPaginateProps) => {
  const { pages, page, keyword = '', isAdmin = false, redirectBaseUrl = '/page/' } = props;

  if (pages === 1) {
    return <></>
  }

  return (
    <Pagination>
      {[...Array(pages).keys()].map(x => (
        <LinkContainer
          key={x + 1}
          to={`${redirectBaseUrl}${x + 1}`}
        >
          <Pagination.Item active={x + 1 === page}>
            {x + 1}
          </Pagination.Item>
        </LinkContainer>
        ))}
    </Pagination>
  )
}

export default ProductPaginate