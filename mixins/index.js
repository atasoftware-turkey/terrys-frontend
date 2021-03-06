import { mapGetters, mapActions } from 'vuex';

const mixin = {
  data: () => ({
    specialRules: [
      (v) => !!v || 'Field is Required',
      (v) =>
        (v.length > 3 && /^[a-zA-Z-]+$/.test(v)) ||
        'Please use only legal characters and dont use whitespace in text.'
    ],
    transactionPrice: [
      (v) => !!v || 'The amount to be transferred must be greater than 0',
      (v) => v !== 0 || 'Please use a correct Wallet Token'
    ],
    transferRules: [
      (v) => !!v || 'Wallet Token is required!',
      (v) => (v.length !== 0 && v.length === 44) || 'Please use a correct Wallet Token'
    ],
    nameRules: [
      (v) => !!v || 'Field is required.',
      (v) => v.length >= 5 || 'Name at least to be 5 characters.'
    ],
    emailRules: [
      (v) => !!v || 'Lütfen geçerli bir email giriniz.',
      (v) =>
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
        'Please use a valid email address.'
    ],
    passwordRules: [
      (v) => !!v || 'Parola alanı gereklidir.',
      (v) =>
        (v && v.length >= 8 && v.length <= 16) ||
        'Şifre uzunluğu en az 8 en fazla 16 karakter olmalıdır'
    ],
    textRules: [
      (v) => !!v || 'Field is required.',
      (v) => (v && v.length >= 2) || 'Field at least to be 5 characters.'
    ],
    phoneRules: [
      (v) => !!v || 'Field is required.',
      (v) => (v && v.length >= 10) || 'Please enter a valid phone number.'
    ],
    identifyRules: [
      (v) => !!v || 'Lütfen Bu Alanı Doldurunuz. ',
      (v) => v.length === 11 || 'Lütfen Geçerli bir telefon numarası giriniz.'
    ],
    numberRules: [
      (v) => !!v || 'Field is required.',
      (v) => /^[0-9]+(\.[0-9]{1,2})?$/gm.test(v) || 'Please enter a valid number.'
    ],
    selectionRules: [
      (v) => !!v || 'Lütfen Bu Alanı Doldurunuz. ',
      (v) => v !== null || 'Lütfen Alan Seçiniz.'
    ],
    fileRules: [(v) => !!v || 'Lütfen Bu Alanı Doldurunuz. ']
  }),
  computed: {
    ...mapGetters([
      'getCartDrawerNav',
      'getCartOrderDetails',
      'getCartDetails',
      'getMobileBottomSheet',
      'getUserModal',
      'getSubtotalPrice',
      'getTotalPrice',
      'getCheckoutStep',
      'getUser'
    ])
  },

  methods: {
    ...mapActions([
      'setCartDrawerNav',
      'setMobileBottomSheet',
      'setUserModal',
      'setCartItem',
      'deleteCartItem',
      'setCartDetail',
      'setCheckoutStep',
      'setUser',
      'updateUser',
      'setCustomerId',
      'updateOrderDelivery',
      'setAllDeliveriesSameAddress',
      'setOrderZipCode',
      'setOrderDeliveryDate',
      'setTotalPrice'
    ])
  }
};

export default mixin;
