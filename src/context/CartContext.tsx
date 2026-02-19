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
import type { Cart, CartItem, Product } from '@/lib/shopify/types'
import {
  getCart,
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
    image: '/images/products/2222.webp',
    href: '/shop/zero-sugar',
  },
  {
    id: 'keffiyah',
    title: 'Keffiyah Edition',
    category: 'LIMITED EDITION',
    price: 28.00,
    originalPrice: null,
    discount: null,
    image: '/images/products/3333.webp',
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
  addItem: (variantId: string, quantity?: number, product?: Product) => Promise<void>
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
      // Always attempt Shopify first - try to load/create Shopify cart
      try {
        const storedCartId = localStorage.getItem(CART_ID_KEY)

        if (storedCartId && storedCartId.startsWith('gid://shopify/Cart')) {
          try {
            const existingCart = await getCart(storedCartId)
            if (existingCart && existingCart.id.startsWith('gid://shopify/Cart')) {
              // Clear demo cart when using Shopify cart
              if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(DEMO_CART_KEY)
              }
              dispatch({ type: 'SET_CART', payload: existingCart })
              setIsInitialized(true)
              return
            } else {
              // Cart ID is invalid or cart doesn't exist, clear it
              console.warn('[Cart] Invalid cart ID, clearing:', storedCartId)
              localStorage.removeItem(CART_ID_KEY)
            }
          } catch (error) {
            // Failed to get cart - might be because Shopify isn't configured
            console.warn('[Cart] Failed to get existing Shopify cart:', error)
            localStorage.removeItem(CART_ID_KEY)
          }
        }

        // Try to create new Shopify cart via API route
        console.log('[Cart] Attempting to create Shopify cart via API...')
        try {
          const createResponse = await fetch('/api/cart?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          
          if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to create cart: HTTP ${createResponse.status}`)
          }
          
          const newCart = await createResponse.json()
          if (newCart.id && newCart.id.startsWith('gid://shopify/Cart')) {
            // Clear demo cart when using Shopify cart
            if (typeof localStorage !== 'undefined') {
              localStorage.removeItem(DEMO_CART_KEY)
              localStorage.setItem(CART_ID_KEY, newCart.id)
            }
            dispatch({ type: 'SET_CART', payload: newCart })
            console.log('[Cart] Shopify cart created:', newCart.id)
            setIsInitialized(true)
            return
          } else {
            console.error('[Cart] Failed to create valid Shopify cart:', newCart)
            throw new Error('Failed to create Shopify cart - invalid cart ID format')
          }
        } catch (createError) {
          console.error('[Cart] Failed to create cart via API:', createError)
          throw createError
        }
      } catch (error) {
        // Shopify operations failed - fall back to demo mode
        console.warn('[Cart] Shopify not available, falling back to demo mode:', error)
        
        // Clear Shopify cart ID if it exists
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(CART_ID_KEY)
        }

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
    async (variantId: string, quantity: number = 1, product?: Product) => {
      dispatch({ type: 'SET_LOADING', payload: true })

      // Check if this is a Shopify variant ID (starts with gid://shopify/ProductVariant)
      const isShopifyVariant = variantId.startsWith('gid://shopify/ProductVariant')
      
      // If it's a Shopify variant, always attempt Shopify operations
      if (isShopifyVariant) {
        try {
          // Always clear demo cart when using Shopify variants
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(DEMO_CART_KEY)
          }

          // Ensure we have a valid Shopify cart (create if null or invalid)
          let cartId = state.cart?.id
          
          if (!cartId || !cartId.startsWith('gid://shopify/Cart')) {
            console.log('[Cart] Creating new Shopify cart for addItem via API...')
            try {
              const createResponse = await fetch('/api/cart?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              })
              
              if (!createResponse.ok) {
                const errorData = await createResponse.json().catch(() => ({}))
                throw new Error(errorData.error || `Failed to create cart: HTTP ${createResponse.status}`)
              }
              
              const newCart = await createResponse.json()
              cartId = newCart.id
              if (cartId && cartId.startsWith('gid://shopify/Cart')) {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem(CART_ID_KEY, newCart.id)
                }
                dispatch({ type: 'SET_CART', payload: newCart })
                console.log('[Cart] New Shopify cart created:', cartId)
              } else {
                console.error('[Cart] Failed to create valid Shopify cart:', newCart)
                throw new Error('Failed to create valid Shopify cart')
              }
            } catch (createError) {
              console.error('[Cart] Failed to create cart via API:', createError)
              throw createError
            }
          }

          // Use API route for adding items
          const addResponse = await fetch('/api/cart?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartId,
              variantId,
              quantity,
            }),
          })
          
          if (!addResponse.ok) {
            const errorData = await addResponse.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to add item: HTTP ${addResponse.status}`)
          }
          
          const updatedCart = await addResponse.json()
          dispatch({ type: 'SET_CART', payload: updatedCart })
          dispatch({ type: 'OPEN_CART' })
          dispatch({ type: 'SET_LOADING', payload: false })
          return
        } catch (error) {
          console.error('[Cart] Failed to add item via Shopify:', error)
          // If Shopify operation fails, check if it's because Shopify isn't configured
          // If product is provided, we can still add it as demo item
          if (product) {
            console.warn('[Cart] Falling back to demo mode for product:', product.title)
            const newItem: CartItem = {
              id: `demo-${product.id}-${variantId}`,
              variantId,
              productId: product.id,
              productHandle: product.handle,
              title: product.title,
              variantTitle: product.variants[0]?.title ?? 'Default Title',
              quantity,
              price: product.price,
              currencyCode: product.currencyCode,
              image: product.featuredImage,
            }
            let items: CartItem[] = state.cart?.items ?? []
            const existing = items.find(
              (i) => i.variantId === variantId || i.productHandle === product.handle
            )
            if (existing) {
              items = items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            } else {
              items = [...items, newItem]
            }
            const updatedCart = calculateCartTotals(items)
            localStorage.setItem(DEMO_CART_KEY, JSON.stringify(updatedCart))
            dispatch({ type: 'SET_CART', payload: updatedCart })
            dispatch({ type: 'OPEN_CART' })
            dispatch({ type: 'SET_LOADING', payload: false })
            return
          }
          // Re-throw error if we can't fall back
          throw error
        }
      }

      // For non-Shopify variant IDs, use demo mode
      try {
        if (!isShopifyConfigured()) {
          // Demo mode: when product is provided, add from product data
          if (product) {
            const newItem: CartItem = {
              id: `demo-${product.id}-${variantId}`,
              variantId,
              productId: product.id,
              productHandle: product.handle,
              title: product.title,
              variantTitle: product.variants[0]?.title ?? 'Default Title',
              quantity,
              price: product.price,
              currencyCode: product.currencyCode,
              image: product.featuredImage,
            }
            let items: CartItem[] = state.cart?.items ?? []
            const existing = items.find(
              (i) => i.variantId === variantId || i.productHandle === product.handle
            )
            if (existing) {
              items = items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            } else {
              items = [...items, newItem]
            }
            const updatedCart = calculateCartTotals(items)
            localStorage.setItem(DEMO_CART_KEY, JSON.stringify(updatedCart))
            dispatch({ type: 'SET_CART', payload: updatedCart })
            dispatch({ type: 'OPEN_CART' })
            dispatch({ type: 'SET_LOADING', payload: false })
            return
          }
          // Fallback: legacy demo product lookup by id
          if (state.cart) {
            addDemoItem(variantId, quantity)
          }
          dispatch({ type: 'SET_LOADING', payload: false })
          return
        }
      } catch (error) {
        console.error('[Cart] Failed to add item:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.cart, addDemoItem, calculateCartTotals]
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
