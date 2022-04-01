<template>
  <div>
    <stripe-checkout
      ref="checkoutRef"
      :pk="pk"
      :items="items"
      :successUrl="successUrl"
      :cancelUrl="cancelUrl"
    />
    <button @click="checkout">Checkout</button>
  </div>
</template>

<script>
export default {
	name: 'StripeBlock',
  data () {
    this.pk = process.env.STRIPE_PK;
    return {
      items: [
        {
          sku: 'sku_FdQKocNoVzznpJ',
          quantity: 1,
        },
      ],
      successUrl: 'http://localhost:3000',
      cancelUrl: 'http://localhost:3000',
    };
  },
  methods: {
    checkout () {
      this.$refs.checkoutRef.redirectToCheckout();
    },
  },
};
</script>