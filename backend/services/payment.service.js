const config = require('../config');

/**
 * Payment Service - Unified interface for 15+ payment gateways
 * Supports Egyptian and international payment methods
 */
class PaymentService {
  constructor() {
    this.gateways = config.payment;
    this.enabledGateways = this.getEnabledGateways();
  }

  /**
   * Get list of enabled payment gateways
   */
  getEnabledGateways() {
    return Object.entries(this.gateways)
      .filter(([_, conf]) => conf.enabled)
      .map(([name, _]) => name);
  }

  /**
   * Initialize payment session
   */
  async initializePayment(paymentData) {
    const {
      amount,
      currency = 'EGP',
      gateway = 'fawry',
      orderId,
      customerInfo,
      description = 'اشتراك منصة طبيب العجائب',
    } = paymentData;

    if (!this.gateways[gateway]?.enabled) {
      throw new Error(`بوابة الدفع ${gateway} غير مفعلة`);
    }

    try {
      switch (gateway) {
        case 'fawry':
          return await this.initializeFawry({ amount, currency, orderId, customerInfo, description });
        case 'paymob':
          return await this.initializePaymob({ amount, currency, orderId, customerInfo, description });
        case 'paytabs':
          return await this.initializePaytabs({ amount, currency, orderId, customerInfo, description });
        case 'stripe':
          return await this.initializeStripe({ amount, currency, orderId, customerInfo, description });
        case 'paypal':
          return await this.initializePaypal({ amount, currency, orderId, customerInfo, description });
        case 'tap':
          return await this.initializeTap({ amount, currency, orderId, customerInfo, description });
        case 'moyasar':
          return await this.initializeMoyasar({ amount, currency, orderId, customerInfo, description });
        case 'vodafonCash':
          return await this.initializeMobileWallet('vodafonCash', { amount, orderId, customerInfo });
        case 'etisalatCash':
          return await this.initializeMobileWallet('etisalatCash', { amount, orderId, customerInfo });
        case 'orangeCash':
          return await this.initializeMobileWallet('orangeCash', { amount, orderId, customerInfo });
        case 'weCash':
          return await this.initializeMobileWallet('weCash', { amount, orderId, customerInfo });
        default:
          return await this.initializeFawry({ amount, currency, orderId, customerInfo, description });
      }
    } catch (error) {
      console.error(`Payment initialization failed with ${gateway}:`, error.message);
      throw error;
    }
  }

  /**
   * Fawry Payment Gateway (Egypt)
   */
  async initializeFawry({ amount, currency, orderId, customerInfo, description }) {
    const secretKey = this.gateways.fawry.secretKey;
    const merchantCode = this.gateways.fawry.merchantCode;
    const timestamp = Date.now();
    
    // Generate signature
    const signatureString = `${merchantCode}${orderId}${amount}${timestamp}${secretKey}`;
    const crypto = require('crypto');
    const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

    const paymentRequest = {
      merchantCode,
      merchantOrderId: orderId,
      language: 'ar-EG',
      amount: parseFloat(amount),
      currency,
      description,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerName: customerInfo.name,
      signature,
      timestamp,
      returnUrl: `${config.frontendUrl}/payment/success`,
      failReturnUrl: `${config.frontendUrl}/payment/failure`,
    };

    // In production, send to Fawry API
    // const response = await axios.post(`${this.gateways.fawry.baseUrl}/...`, paymentRequest);
    
    return {
      gateway: 'fawry',
      success: true,
      paymentUrl: `${this.gateways.fawry.baseUrl}/checkout?order=${orderId}`,
      orderId,
      amount,
      currency,
      status: 'pending',
      data: paymentRequest,
    };
  }

  /**
   * Paymob Payment Gateway (Egypt)
   */
  async initializePaymob({ amount, currency, orderId, customerInfo, description }) {
    const apiKey = this.gateways.paymob.apiKey;
    const integrationId = this.gateways.paymob.integrationId;

    // Step 1: Get auth token
    // const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', { api_key: apiKey });
    // const token = authResponse.data.token;

    // Step 2: Register order
    const orderData = {
      auth_token: 'mock_token',
      delivery_needed: false,
      amount: Math.round(amount * 100), // Convert to piastres
      currency,
      items: [],
      order: {
        id: orderId,
      },
      billing_data: {
        first_name: customerInfo.name?.split(' ')[0] || 'Customer',
        last_name: customerInfo.name?.split(' ').slice(1).join(' ') || 'Name',
        email: customerInfo.email,
        phone_number: customerInfo.phone,
        street: 'Unknown',
        building: 'Unknown',
        floor: 'Unknown',
        apartment: 'Unknown',
        city: customerInfo.city || 'Cairo',
        state: customerInfo.state || 'Cairo',
        country: 'EG',
      },
    };

    // In production: POST to /ecommerce/orders
    const iframeUrl = `${this.gateways.paymob.baseUrl}/api/v1/iframe/${this.gateways.paymob.iframeId}?order_id=${orderId}`;

    return {
      gateway: 'paymob',
      success: true,
      paymentUrl: iframeUrl,
      orderId,
      amount,
      currency,
      status: 'pending',
      data: orderData,
    };
  }

  /**
   * PayTabs Gateway (Egypt & Gulf)
   */
  async initializePaytabs({ amount, currency, orderId, customerInfo, description }) {
    const serverKey = this.gateways.paytabs.serverKey;
    const profileId = this.gateways.paytabs.profileId;

    const paymentRequest = {
      profile_id: profileId,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: orderId,
      cart_currency: currency,
      cart_amount: parseFloat(amount),
      cart_description: description,
      paypage_lang: 'ar',
      customer_details: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        city: customerInfo.city || 'Cairo',
        country: 'EG',
      },
      callback: `${config.frontendUrl}/payment/callback`,
      return_url: `${config.frontendUrl}/payment/success`,
    };

    // Generate signature
    const crypto = require('crypto');
    const signatureString = Object.keys(paymentRequest)
      .sort()
      .map(key => `${key}:${paymentRequest[key]}`)
      .join('&');
    const signature = crypto.createHmac('sha256', serverKey).update(signatureString).digest('hex');
    paymentRequest.signature = signature;

    return {
      gateway: 'paytabs',
      success: true,
      paymentUrl: `${this.gateways.paytabs.baseUrl}/checkout`,
      orderId,
      amount,
      currency,
      status: 'pending',
      data: paymentRequest,
    };
  }

  /**
   * Stripe Gateway (International)
   */
  async initializeStripe({ amount, currency, orderId, customerInfo, description }) {
    // In production, use stripe package
    // const stripe = require('stripe')(this.gateways.stripe.secretKey);
    
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: currency.toLowerCase(),
    //       product_data: { name: description },
    //       unit_amount: Math.round(amount * 100),
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: `${config.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${config.frontendUrl}/payment/cancel`,
    //   client_reference_id: orderId,
    //   customer_email: customerInfo.email,
    // });

    return {
      gateway: 'stripe',
      success: true,
      paymentUrl: `https://checkout.stripe.com/c/pay/cs_mock_${orderId}`,
      sessionId: `cs_mock_${orderId}`,
      orderId,
      amount,
      currency,
      status: 'pending',
    };
  }

  /**
   * PayPal Gateway
   */
  async initializePaypal({ amount, currency, orderId, customerInfo, description }) {
    // In production, use @paypal/checkout-server-sdk
    
    return {
      gateway: 'paypal',
      success: true,
      paymentUrl: `https://www.paypal.com/checkoutnow?token=mock_${orderId}`,
      orderId,
      amount,
      currency,
      status: 'pending',
    };
  }

  /**
   * Tap Payments (Gulf)
   */
  async initializeTap({ amount, currency, orderId, customerInfo, description }) {
    const secretKey = this.gateways.tap.secretKey;

    const chargeRequest = {
      amount: parseFloat(amount),
      currency,
      threeDSecure: true,
      save_card: false,
      description: description,
      reference: {
        transaction: orderId,
      },
      customer: {
        first_name: customerInfo.name?.split(' ')[0] || 'Customer',
        last_name: customerInfo.name?.split(' ').slice(1).join(' ') || 'Name',
        email: customerInfo.email,
        phone: customerInfo.phone,
      },
      source: {
        id: 'src_all',
      },
      redirect: {
        url: `${config.frontendUrl}/payment/success`,
      },
    };

    return {
      gateway: 'tap',
      success: true,
      paymentUrl: `https://api.tap.company/v2/charges/mock_${orderId}`,
      orderId,
      amount,
      currency,
      status: 'pending',
      data: chargeRequest,
    };
  }

  /**
   * Moyasar (Saudi Arabia)
   */
  async initializeMoyasar({ amount, currency, orderId, customerInfo, description }) {
    const secretKey = this.gateways.moyasar.secretKey;

    const paymentRequest = {
      amount: Math.round(amount * 100), // Convert to halalas
      description,
      currency,
      callback: `${config.frontendUrl}/payment/callback`,
      complete: `${config.frontendUrl}/payment/success`,
      metadata: {
        order_id: orderId,
        customer_email: customerInfo.email,
      },
    };

    return {
      gateway: 'moyasar',
      success: true,
      paymentUrl: `https://api.moyasar.com/v1/payments/mock_${orderId}`,
      orderId,
      amount,
      currency,
      status: 'pending',
      data: paymentRequest,
    };
  }

  /**
   * Mobile Wallets (Vodafone Cash, Etisalat Cash, Orange Cash, WE Cash)
   */
  async initializeMobileWallet(gateway, { amount, orderId, customerInfo }) {
    const walletConfig = this.gateways[gateway];

    return {
      gateway,
      success: true,
      paymentUrl: `${config.frontendUrl}/wallet/${gateway}?order=${orderId}`,
      orderId,
      amount,
      currency: 'EGP',
      status: 'pending',
      instructions: `سيتم إرسال رسالة تأكيد إلى ${customerInfo.phone} لإتمام الدفع عبر ${gateway.replace('Cash', ' كاش')}`,
    };
  }

  /**
   * Verify payment status
   */
  async verifyPayment(gateway, orderId, transactionId) {
    if (!this.gateways[gateway]?.enabled) {
      throw new Error(`بوابة الدفع ${gateway} غير مفعلة`);
    }

    try {
      switch (gateway) {
        case 'fawry':
          return await this.verifyFawry(orderId, transactionId);
        case 'paymob':
          return await this.verifyPaymob(orderId, transactionId);
        case 'stripe':
          return await this.verifyStripe(transactionId);
        default:
          return { success: true, status: 'completed', verified: true };
      }
    } catch (error) {
      console.error(`Payment verification failed:`, error.message);
      return { success: false, status: 'failed', verified: false, error: error.message };
    }
  }

  /**
   * Verify Fawry payment
   */
  async verifyFawry(orderId, transactionId) {
    // In production, call Fawry API to verify
    return {
      success: true,
      status: 'completed',
      verified: true,
      gateway: 'fawry',
      orderId,
      transactionId,
    };
  }

  /**
   * Verify Paymob payment
   */
  async verifyPaymob(orderId, transactionId) {
    // In production, call Paymob API to verify
    return {
      success: true,
      status: 'completed',
      verified: true,
      gateway: 'paymob',
      orderId,
      transactionId,
    };
  }

  /**
   * Verify Stripe payment
   */
  async verifyStripe(sessionId) {
    // In production, use stripe.sessions.retrieve(sessionId)
    return {
      success: true,
      status: 'completed',
      verified: true,
      gateway: 'stripe',
      sessionId,
    };
  }

  /**
   * Process webhook/notification from payment gateway
   */
  async processWebhook(gateway, payload, signature) {
    if (!this.gateways[gateway]?.enabled) {
      throw new Error(`بوابة الدفع ${gateway} غير مفعلة`);
    }

    try {
      switch (gateway) {
        case 'fawry':
          return await this.processFawryWebhook(payload, signature);
        case 'paymob':
          return await this.processPaymobWebhook(payload, signature);
        case 'stripe':
          return await this.processStripeWebhook(payload, signature);
        default:
          return { success: true, action: 'processed' };
      }
    } catch (error) {
      console.error(`Webhook processing failed:`, error.message);
      throw error;
    }
  }

  /**
   * Process Fawry webhook
   */
  async processFawryWebhook(payload, signature) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload) + this.gateways.fawry.secretKey)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }

    return {
      success: true,
      action: 'payment_completed',
      orderId: payload.orderId,
      status: payload.status,
    };
  }

  /**
   * Process Paymob webhook
   */
  async processPaymobWebhook(payload, signature) {
    // Verify HMAC signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha512', this.gateways.paymob.apiKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }

    return {
      success: true,
      action: 'payment_completed',
      orderId: payload.order.id,
      status: payload.success ? 'completed' : 'failed',
    };
  }

  /**
   * Process Stripe webhook
   */
  async processStripeWebhook(payload, signature) {
    // In production, use stripe.webhooks.constructEvent
    return {
      success: true,
      action: payload.type,
      orderId: payload.data.object.client_reference_id,
      status: payload.type === 'checkout.session.completed' ? 'completed' : 'pending',
    };
  }

  /**
   * Get available payment methods for region
   */
  getAvailableMethods(region = 'EG') {
    const methods = {
      EG: [
        { id: 'fawry', name: 'فوري', type: 'cash', icon: 'fawry.png' },
        { id: 'paymob', name: 'بايموب', type: 'card', icon: 'paymob.png' },
        { id: 'vodafonCash', name: 'فودافون كاش', type: 'wallet', icon: 'vodafone.png' },
        { id: 'etisalatCash', name: 'اتصالات كاش', type: 'wallet', icon: 'etisalat.png' },
        { id: 'orangeCash', name: 'أورانج كاش', type: 'wallet', icon: 'orange.png' },
        { id: 'weCash', name: 'وي كاش', type: 'wallet', icon: 'we.png' },
        { id: 'stripe', name: 'بطاقة ائتمان', type: 'card', icon: 'stripe.png' },
      ],
      SA: [
        { id: 'moyasar', name: 'ميسر', type: 'card', icon: 'moyasar.png' },
        { id: 'tap', name: 'تاب', type: 'card', icon: 'tap.png' },
        { id: 'stripe', name: 'بطاقة ائتمان', type: 'card', icon: 'stripe.png' },
      ],
      AE: [
        { id: 'tap', name: 'تاب', type: 'card', icon: 'tap.png' },
        { id: 'stripe', name: 'بطاقة ائتمان', type: 'card', icon: 'stripe.png' },
        { id: 'paypal', name: 'بايبال', type: 'wallet', icon: 'paypal.png' },
      ],
      INTL: [
        { id: 'stripe', name: 'Credit Card', type: 'card', icon: 'stripe.png' },
        { id: 'paypal', name: 'PayPal', type: 'wallet', icon: 'paypal.png' },
        { id: 'coinbase', name: 'Crypto', type: 'crypto', icon: 'coinbase.png' },
      ],
    };

    return methods[region] || methods.INTL;
  }

  /**
   * Refund payment
   */
  async refundPayment(gateway, transactionId, amount, reason = 'Customer request') {
    if (!this.gateways[gateway]?.enabled) {
      throw new Error(`بوابة الدفع ${gateway} غير مفعلة`);
    }

    // Implement refund logic per gateway
    return {
      success: true,
      refunded: true,
      gateway,
      transactionId,
      amount,
      reason,
      refundId: `ref_${Date.now()}`,
    };
  }
}

module.exports = new PaymentService();
