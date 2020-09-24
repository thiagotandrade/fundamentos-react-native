import React, { useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View } from 'react-native';

import {
  Container,
  ProductContainer,
  ProductList,
  Product,
  ProductImage,
  ProductTitleContainer,
  ProductTitle,
  ProductPriceContainer,
  ProductSinglePrice,
  TotalContainer,
  ProductPrice,
  ProductQuantity,
  ActionContainer,
  ActionButton,
  TotalProductsContainer,
  TotalProductsText,
  SubtotalValue,
} from './styles';

import { useCart } from '../../hooks/cart';

import formatValue from '../../utils/formatValue';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const { removeFromCart, increment, decrement, products } = useCart();

  function handleIncrement(id: string): void {
    // TODO
    increment(id);
  }

  function handleDecrement(id: string): void {
    // TODO
    const product = products.find(p => p.id === id);

    if (product) {
      if (product.quantity === 1) {
        removeFromCart(id);
      } else {
        decrement(id);
      }
    }
  }

  const cartTotal = useMemo(() => {
    // TODO RETURN THE SUM OF THE PRICE OF THE PRODUCTS IN THE CART
    const { price } = products.reduce(
      (accumulator, product) => {
        accumulator.price += product.price * product.quantity;

        return accumulator;
      },
      {
        price: 0,
      },
    );

    return formatValue(price);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const { quantity } = products.reduce(
      (accumulator, product) => {
        accumulator.quantity += product.quantity;

        return accumulator;
      },
      {
        quantity: 0,
      },
    );

    return quantity;
  }, [products]);

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }: { item: Product }) => (
            <Product>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitleContainer>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductPriceContainer>
                  <ProductSinglePrice>
                    {formatValue(item.price)}
                  </ProductSinglePrice>

                  <TotalContainer>
                    <ProductQuantity>{`${item.quantity}x`}</ProductQuantity>

                    <ProductPrice>
                      {formatValue(item.price * item.quantity)}
                    </ProductPrice>
                  </TotalContainer>
                </ProductPriceContainer>
              </ProductTitleContainer>
              <ActionContainer>
                <ActionButton
                  testID={`increment-${item.id}`}
                  onPress={() => handleIncrement(item.id)}
                >
                  <FeatherIcon name="plus" color="#E83F5B" size={16} />
                </ActionButton>
                <ActionButton
                  testID={`decrement-${item.id}`}
                  onPress={() => handleDecrement(item.id)}
                >
                  <FeatherIcon name="minus" color="#E83F5B" size={16} />
                </ActionButton>
              </ActionContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <TotalProductsContainer>
        <FeatherIcon name="shopping-cart" color="#fff" size={24} />
        <TotalProductsText>{`${totalItensInCart} itens`}</TotalProductsText>
        <SubtotalValue>{cartTotal}</SubtotalValue>
      </TotalProductsContainer>
    </Container>
  );
};

export default Cart;
