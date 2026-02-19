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
} from '@/lib/shopify/queries/cart'
// All cart operations now use Shopify API routes (/api/cart)

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

  // DEPRECATED: calculateCartTotals removed - all carts are Shopify carts now

  // Initialize cart on mount
  useEffect(() => {
    async function initializeCart() {
      // Always clear demo cart first - we want to use Shopify carts only
      if (typeof localStorage !== 'undefined') {
        const demoCart = localStorage.getItem(DEMO_CART_KEY)
        if (demoCart) {
          console.log('[Cart] Found demo cart, clearing it to use Shopify cart')
          localStorage.removeItem(DEMO_CART_KEY)
        }
      }
      
      // Always attempt Shopify first - try to load/create Shopify cart
      try {
        const storedCartId = localStorage.getItem(CART_ID_KEY)

        // Only use stored ID if it's a valid Shopify cart ID
        if (storedCartId && !storedCartId.startsWith('gid://shopify/Cart')) {
          console.warn('[Cart] Invalid stored cart ID, clearing:', storedCartId.substring(0, 40))
          localStorage.removeItem(CART_ID_KEY)
          localStorage.removeItem(DEMO_CART_KEY)
        }
        if (storedCartId && storedCartId.startsWith('gid://shopify/Cart')) {
          try {
            const existingCart = await getCart(storedCartId)
            if (existingCart && existingCart.id.startsWith('gid://shopify/Cart')) {
              // Ensure demo cart is cleared
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
            // Ensure demo cart is cleared
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
        // Shopify operations failed - don't fall back to demo mode
        console.error('[Cart] Failed to initialize Shopify cart:', error)
        
        // Clear any invalid cart IDs
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(CART_ID_KEY)
          localStorage.removeItem(DEMO_CART_KEY)
        }

        // Set cart to null - user will need to add items to create a cart
        dispatch({
          type: 'SET_CART',
          payload: null,
        })
      } finally {
        setIsInitialized(true)
      }
    }

    initializeCart()
  }, [])

  // DEPRECATED: addDemoItem removed - all carts must use Shopify

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
          
          // CRITICAL: Ensure cart is properly updated with latest state
          if (updatedCart && updatedCart.id && updatedCart.id.startsWith('gid://shopify/Cart')) {
            // Update localStorage with latest cart ID
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(CART_ID_KEY, updatedCart.id)
              localStorage.removeItem(DEMO_CART_KEY)
            }
            
            console.log('[Cart] Item added successfully:', {
              cartId: updatedCart.id,
              itemsCount: updatedCart.items?.length || 0,
              totalQuantity: updatedCart.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0,
              items: updatedCart.items?.map((item: any) => `${item.title} x${item.quantity}`) || [],
            })
            
            dispatch({ type: 'SET_CART', payload: updatedCart })
            dispatch({ type: 'OPEN_CART' })
            dispatch({ type: 'SET_LOADING', payload: false })
            return
          } else {
            console.error('[Cart] Invalid cart returned after adding item:', updatedCart)
            throw new Error('Invalid cart returned from Shopify')
          }
        } catch (error) {
          console.error('[Cart] Failed to add item via Shopify:', error)
          // Don't fall back to demo mode - throw error instead
          throw error
        }
      } else {
        // Non-Shopify variant ID - this shouldn't happen if products are from Shopify
        console.error('[Cart] addItem: Non-Shopify variant ID provided:', variantId)
        throw new Error('Invalid variant ID. Only Shopify product variants are supported.')
      }
    },
    [state.cart]
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cart) return

      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        // Check if cart is a Shopify cart
        const isShopifyCart = state.cart.id.startsWith('gid://shopify/Cart')
        
        if (!isShopifyCart) {
          // If not a Shopify cart, try to create one and migrate items
          console.warn('[Cart] updateItem: Cart is not a Shopify cart, attempting to create Shopify cart...')
          
          // Create new Shopify cart
          const createResponse = await fetch('/api/cart?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          
          if (!createResponse.ok) {
            throw new Error('Failed to create Shopify cart for updateItem')
          }
          
          const newCart = await createResponse.json()
          if (!newCart.id || !newCart.id.startsWith('gid://shopify/Cart')) {
            throw new Error('Invalid Shopify cart created')
          }
          
          // Migrate all items to new Shopify cart
          if (state.cart.items.length > 0) {
            for (const item of state.cart.items) {
              // Only migrate if it's a Shopify variant
              if (item.variantId.startsWith('gid://shopify/ProductVariant')) {
                await fetch('/api/cart?action=add', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    cartId: newCart.id,
                    variantId: item.variantId,
                    quantity: item.id === lineId ? quantity : item.quantity,
                  }),
                })
              }
            }
          }
          
          // Reload cart
          const getResponse = await fetch(`/api/cart?id=${encodeURIComponent(newCart.id)}`)
          if (getResponse.ok) {
            const updatedCart = await getResponse.json()
            dispatch({ type: 'SET_CART', payload: updatedCart })
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(CART_ID_KEY, updatedCart.id)
              localStorage.removeItem(DEMO_CART_KEY)
            }
          }
          dispatch({ type: 'SET_LOADING', payload: false })
          return
        }

        // Use API route for updating items (always use Shopify)
        const updateResponse = await fetch('/api/cart?action=update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId: state.cart.id,
            lineId,
            quantity,
          }),
        })
        
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to update item: HTTP ${updateResponse.status}`)
        }
        
        const updatedCart = await updateResponse.json()
        dispatch({ type: 'SET_CART', payload: updatedCart })
        
        // Ensure demo cart is cleared
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(DEMO_CART_KEY)
        }
      } catch (error) {
        console.error('[Cart] Failed to update item:', error)
        // Don't fall back to demo mode - show error instead
        throw error
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.cart]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!state.cart) return

      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        // Check if cart is a Shopify cart
        const isShopifyCart = state.cart.id.startsWith('gid://shopify/Cart')
        
        if (!isShopifyCart) {
          // If not a Shopify cart, try to create one
          console.warn('[Cart] removeItem: Cart is not a Shopify cart, attempting to create Shopify cart...')
          
          // Create new Shopify cart
          const createResponse = await fetch('/api/cart?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          
          if (!createResponse.ok) {
            throw new Error('Failed to create Shopify cart for removeItem')
          }
          
          const newCart = await createResponse.json()
          if (!newCart.id || !newCart.id.startsWith('gid://shopify/Cart')) {
            throw new Error('Invalid Shopify cart created')
          }
          
          // Migrate all items except the one being removed
          if (state.cart.items.length > 0) {
            for (const item of state.cart.items) {
              if (item.id !== lineId && item.variantId.startsWith('gid://shopify/ProductVariant')) {
                await fetch('/api/cart?action=add', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    cartId: newCart.id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                  }),
                })
              }
            }
          }
          
          // Reload cart
          const getResponse = await fetch(`/api/cart?id=${encodeURIComponent(newCart.id)}`)
          if (getResponse.ok) {
            const updatedCart = await getResponse.json()
            dispatch({ type: 'SET_CART', payload: updatedCart })
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(CART_ID_KEY, updatedCart.id)
              localStorage.removeItem(DEMO_CART_KEY)
            }
          }
          dispatch({ type: 'SET_LOADING', payload: false })
          return
        }

        // Use API route for removing items (always use Shopify)
        const removeResponse = await fetch('/api/cart?action=remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId: state.cart.id,
            lineIds: [lineId],
          }),
        })
        
        if (!removeResponse.ok) {
          const errorData = await removeResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to remove item: HTTP ${removeResponse.status}`)
        }
        
        const updatedCart = await removeResponse.json()
        dispatch({ type: 'SET_CART', payload: updatedCart })
        
        // Ensure demo cart is cleared
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(DEMO_CART_KEY)
        }
      } catch (error) {
        console.error('[Cart] Failed to remove item:', error)
        // Don't fall back to demo mode - show error instead
        throw error
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.cart]
  )

  const clearCart = useCallback(async () => {
    // Clear both demo and Shopify carts from localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(DEMO_CART_KEY)
      localStorage.removeItem(CART_ID_KEY)
    }
    
    // Always create a new Shopify cart (no demo fallback)
    try {
      const createResponse = await fetch('/api/cart?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (createResponse.ok) {
        const newCart = await createResponse.json()
        if (newCart.id && newCart.id.startsWith('gid://shopify/Cart')) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(CART_ID_KEY, newCart.id)
          }
          dispatch({ type: 'SET_CART', payload: newCart })
          console.log('[Cart] Cleared and created new Shopify cart:', newCart.id)
          return
        }
      }
      throw new Error('Failed to create Shopify cart')
    } catch (error) {
      console.error('[Cart] Failed to create Shopify cart after clear:', error)
      // Set cart to null instead of demo cart
      dispatch({ type: 'SET_CART', payload: null })
    }
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
