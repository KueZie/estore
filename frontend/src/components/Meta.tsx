import React from 'react'
import { Helmet } from 'react-helmet-async'

export interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
}

// Meta component used to handle the meta tags for the application
const Meta = (props: MetaProps) => {
  const { title, description, keywords } = props

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to ProShop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electronics'
}

export default Meta