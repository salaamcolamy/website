/**
 * Shopify Admin API Customer Queries & Mutations
 * 
 * Handles customer creation and email marketing consent management
 */

import { shopifyAdminFetch, isAdminApiConfigured } from '../admin-client'

export interface CustomerEmailMarketingConsent {
  marketingState: 'SUBSCRIBED' | 'NOT_SUBSCRIBED' | 'REDACTED' | 'INVALID'
  marketingOptInLevel: 'SINGLE_OPT_IN' | 'CONFIRMED_OPT_IN' | 'UNKNOWN'
  consentUpdatedAt?: string
}

export interface CreateCustomerWithConsentInput {
  email: string
  firstName?: string
  lastName?: string
  acceptsMarketing?: boolean
  marketingConsent?: {
    marketingState: 'SUBSCRIBED' | 'NOT_SUBSCRIBED'
    marketingOptInLevel: 'SINGLE_OPT_IN' | 'CONFIRMED_OPT_IN'
  }
}

export interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  acceptsMarketing: boolean
  emailMarketingConsent?: CustomerEmailMarketingConsent
}

/**
 * Create a customer with email marketing consent
 */
export async function createCustomerWithMarketingConsent(
  input: CreateCustomerWithConsentInput
): Promise<Customer> {
  if (!isAdminApiConfigured()) {
    throw new Error('Shopify Admin API not configured')
  }

  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          acceptsMarketing
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      acceptsMarketing: input.acceptsMarketing ?? true,
      emailMarketingConsent: input.marketingConsent || {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    },
  }

  const data = await shopifyAdminFetch<{
    customerCreate: {
      customer: Customer | null
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>({
    query: mutation,
    variables,
  })

  if (data.customerCreate.userErrors.length > 0) {
    const error = data.customerCreate.userErrors[0]
    throw new Error(error.message || 'Failed to create customer')
  }

  if (!data.customerCreate.customer) {
    throw new Error('Failed to create customer')
  }

  return data.customerCreate.customer
}

/**
 * Update customer email marketing consent
 */
export async function updateCustomerMarketingConsent(
  customerId: string,
  marketingConsent: {
    marketingState: 'SUBSCRIBED' | 'NOT_SUBSCRIBED'
    marketingOptInLevel: 'SINGLE_OPT_IN' | 'CONFIRMED_OPT_IN'
  }
): Promise<Customer> {
  if (!isAdminApiConfigured()) {
    throw new Error('Shopify Admin API not configured')
  }

  const mutation = `
    mutation customerEmailMarketingConsentUpdate($customerId: ID!, $emailMarketingConsent: CustomerEmailMarketingConsentInput!) {
      customerEmailMarketingConsentUpdate(
        customerId: $customerId
        emailMarketingConsent: $emailMarketingConsent
      ) {
        customer {
          id
          email
          acceptsMarketing
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    customerId,
    emailMarketingConsent: {
      marketingState: marketingConsent.marketingState,
      marketingOptInLevel: marketingConsent.marketingOptInLevel,
      consentUpdatedAt: new Date().toISOString(),
    },
  }

  const data = await shopifyAdminFetch<{
    customerEmailMarketingConsentUpdate: {
      customer: Customer | null
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>({
    query: mutation,
    variables,
  })

  if (data.customerEmailMarketingConsentUpdate.userErrors.length > 0) {
    const error = data.customerEmailMarketingConsentUpdate.userErrors[0]
    throw new Error(error.message || 'Failed to update marketing consent')
  }

  if (!data.customerEmailMarketingConsentUpdate.customer) {
    throw new Error('Failed to update marketing consent')
  }

  return data.customerEmailMarketingConsentUpdate.customer
}

/**
 * Find customer by email
 */
export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  if (!isAdminApiConfigured()) {
    throw new Error('Shopify Admin API not configured')
  }

  const query = `
    query getCustomerByEmail($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
            email
            firstName
            lastName
            acceptsMarketing
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
              consentUpdatedAt
            }
          }
        }
      }
    }
  `

  const variables = {
    query: `email:${email}`,
  }

  const data = await shopifyAdminFetch<{
    customers: {
      edges: Array<{
        node: Customer
      }>
    }
  }>({
    query,
    variables,
  })

  return data.customers.edges[0]?.node || null
}

/**
 * Subscribe email to marketing (creates customer if doesn't exist, updates if exists)
 */
export async function subscribeEmailToMarketing(email: string): Promise<Customer> {
  if (!isAdminApiConfigured()) {
    throw new Error('Shopify Admin API not configured')
  }

  // Try to find existing customer
  const existingCustomer = await findCustomerByEmail(email)

  if (existingCustomer) {
    // Update existing customer's marketing consent
    return updateCustomerMarketingConsent(existingCustomer.id, {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    })
  } else {
    // Create new customer with marketing consent
    return createCustomerWithMarketingConsent({
      email,
      acceptsMarketing: true,
      marketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    })
  }
}
