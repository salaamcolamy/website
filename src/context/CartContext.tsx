'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import type { Cart, CartItem } from '@/lib/shopify/types'
import {
  createCart,
  getCart,
  addToCart as addToCartAPI,
  updateCartLine as updateCartLineAPI,
  removeFromCart as removeFromCartAPI,
} from '@/lib/shopify/queries/cart'
import { isShopifyConfigured } from '@/lib/shopify/client'

// Demo products for simulation
export const demoProducts = [
  {
    id: 'original',
    title: 'Original',
    category: 'CLASSIC',
    price: 20.00,
    originalPrice: 26.00,
    discount: 23,
    image: '/images/products/1111.webp',
    href: '/shop/original',
  },
  {
    id: 'zero-sugar',
    title: 'Zero Sugar',
    category: 'NO SUGAR',
    price: 34.00,
    originalPrice: 38.00,
    discount: 11,
    image: '/images/products/3333.webp',
    href: '/shop/zero-sugar',
  },
  {
    id: 'keffiyah',
    title: 'Keffiyah Edition',
    category: 'LIMITED EDITION',
    price: 28.00,
    originalPrice: null,
    discount: null,
    image: '/images/products/2222.webp',
    href: '/shop/keffiyeh',
  },
]

interface CartState {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }

const initialState: CartState = {
  cart: null,
  isOpen: false,
  isLoading: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (variantId: string, quantity?: number) => Promise<void>
  addDemoItem: (productId: string, quantity?: number) => void
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_ID_KEY = 'salaamcola-cart-id'
const DEMO_CART_KEY = 'salaamcola-demo-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isInitialized, setIsInitialized] = useState(false)

  // Helper to calculate cart totals
  const calculateCartTotals = (items: CartItem[]): Cart => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    return {
      id: 'demo-cart',
      checkoutUrl: '/checkout',
      totalQuantity,
      subtotal,
      total: subtotal,
      currencyCode: 'MYR',
      items,
    }
  }

  // Initialize cart on mount
  useEffect(() => {
    async function initializeCart() {
      if (!isShopifyConfigured()) {
        // For demo mode, load cart from localStorage or create empty
        try {
          const storedCart = localStorage.getItem(DEMO_CART_KEY)
          if (storedCart) {
            const parsedCart = JSON.parse(storedCart) as Cart
            dispatch({ type: 'SET_CART', payload: parsedCart })
          } else {
            dispatch({
              type: 'SET_CART',
              payload: {
                id: 'demo-cart',
                checkoutUrl: '/checkout',
                totalQuantity: 0,
                subtotal: 0,
                total: 0,
                currencyCode: 'MYR',
                items: [],
              },
            })
          }
        } catch {
          dispatch({
            type: 'SET_CART',
            payload: {
              id: 'demo-cart',
              checkoutUrl: '/checkout',
              totalQuantity: 0,
              subtotal: 0,
              total: 0,
              currencyCode: 'MYR',
              items: [],
            },
          })
        }
        setIsInitialized(true)
        return
      }

      try {
        const storedCartId = localStorage.getItem(CART_ID_KEY)

        if (storedCartId) {
          const existingCart = await getCart(storedCartId)
          if (existingCart) {
            dispatch({ type: 'SET_CART', payload: existingCart })
            setIsInitialized(true)
            return
          }
        }

        // Create new cart
        const newCart = await createCart()
        localStorage.setItem(CART_ID_KEY, newCart.id)
        dispatch({ type: 'SET_CART', payload: newCart })
      } catch (error) {
        console.error('Failed to initialize cart:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeCart()
  }, [])

  const addDemoItem = useCallback(
    (productId: string, quantity: number = 1) => {
      if (!state.cart) return

      const product = demoProducts.find((p) => p.id === productId)
      if (!product) return

      dispatch({ type: 'SET_LOADING', payload: true })

      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.productHandle === productId
      )

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `demo-item-${productId}-${Date.now()}`,
          variantId: `variant-${productId}`,
          productId: `product-${productId}`,
          title: product.title,
          variantTitle: 'Default',
          productHandle: productId,
          quantity,
          price: product.price,
          currencyCode: 'MYR',
          image: {
            url: product.image,
            altText: product.title,
            width: 500,
            height: 500,
          },
        }
        updatedItems = [...state.cart.items, newItem]
      }

      const updatedCart = calculateCartTotals(updatedItems)
      localStorage.setItem(DEMO_CART_KEY, JSON.stringify(updatedCart))
      dispatch({ type: 'SET_CART', payload: updatedCart })
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'OPEN_CART' })
    },
    [state.cart, calculateCartTotals]
  )

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!state.cart) return

      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        if (!isShopifyConfigured()) {
          // Use demo item for non-Shopify mode
          addDemoItem(variantId, quantity)
          return
        }

        const updatedCart = await addToCartAPI(state.cart.id, variantId, quantity)
        dispatch({ type: 'SET_CART', payload: updatedCart })
        dispatch({ type: 'OPEN_CART' })
      } catch (error) {
        console.error('Failed to add item:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.cart, addDemoItem]
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cart) return

      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        if (!isShopifyConfigured()) {
          // Demo mode update
          const updatedItems = state.cart.items.map((item) =>
            item.id === lineId ? { ...item, quantity } : item
          )
          const updatedCart = calculateCartTotals(updatedItems)
          localStorage.setItem(DEMO_CART_KEY, JSON.stringify(updatedCart))
          dispatch({ type: 'SET_CART', payload: updatedCart })
          dispatch({ type: 'SET_LOADING', payload: false })
          return
        }

        const updatedCart = await updateCartLineAPI(state.cart.id, lineId, quantity)
        dispatch({ type: 'SET_CART', payload: updatedCart })
      } catch (error) {
        console.error('Failed to update item:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.cart, calculateCartTotals]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!state.cart) return

      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        if (!isShopifyConfigured()) {
          // Demo mode remove
          const updatedItems = state.cart.items.filter((item) => item.id !== lineId)
          const updatedCart = calculateCartTotals(updatedItems)
          localStorage.setItem(DEMO_CART_KEY, JSON.stringify(updatedCart))
          dispatch({ type: 'SET_CART', payload: updatedCart })
          dispatch({ type: 'SET_LOADING', payload: false })
          return
        }

        const updatedCart = await removeFromCartAPI(state.cart.id, [lineId])
        dispatch({ type: 'SET_CART', payload: updatedCart })
      } catch (error) {
        console.error('Failed to remove item:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.cart, calculateCartTotals]
  )

  const clearCart = useCallback(() => {
    const emptyCart: Cart = {
      id: 'demo-cart',
      checkoutUrl: '/checkout',
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
      currencyCode: 'MYR',
      items: [],
    }
    localStorage.setItem(DEMO_CART_KEY, JSON.stringify(emptyCart))
    dispatch({ type: 'SET_CART', payload: emptyCart })
  }, [])

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' })
  }, [])

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' })
  }, [])

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' })
  }, [])

  if (!isInitialized) {
    return null
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        addDemoItem,
        updateItem,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
