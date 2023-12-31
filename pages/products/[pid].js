import fs from 'fs/promises'
import path from 'path';

import { Fragment } from "react";

function ProductDetailPage({ loadedProduct }) {

  if (!loadedProduct) {
    return <p>Loading...</p>
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  )
}

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  const { params } = context;

  const productId = params.pid;

  const data = await getData();

  const product = data.products.find((prod) => {
    return prod.id === productId;
  })

  if (!product) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      loadedProduct: product
    }
  }
}

export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => {
    return product.id;
  })

  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }))

  return {
    paths: pathsWithParams,
    fallback: true
  };
}

export default ProductDetailPage;