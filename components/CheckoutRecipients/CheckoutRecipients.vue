<script>
export default {
  data: () => ({
    occasions: [
      {
        id: 1,
        title: 'Anniversary',
        options: '{"ftdCode": "ANNIVERSARY", "bloomnetCode": 7}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 2,
        title: 'Birthday',
        options: '{"ftdCode": "BIRTHDAY", "bloomnetCode": 3}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 3,
        title: 'Business',
        options: '{"ftdCode": "BUSINESS", "bloomnetCode": 4}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 4,
        title: 'Funeral',
        options: '{"ftdCode": "FUNERAL", "bloomnetCode": 1}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 5,
        title: 'Holiday',
        options: '{"ftdCode": "HOLIDAY", "bloomnetCode": 5}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 6,
        title: 'Illness',
        options: '{"ftdCode": "GET_WELL", "bloomnetCode": 2}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 7,
        title: 'Others',
        options: '{"ftdCode": "OTHER", "bloomnetCode": 8}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      },
      {
        id: 8,
        title: 'Valentines Day',
        options: '{"ftdCode": "MATERNITY", "bloomnetCode": 6}',
        createdAt: '2022-05-29 10:16:54',
        updatedAt: '2022-05-29 10:16:54'
      }
    ],
    useSameAddress: false,
    dateModalValue: false,
    dateModalIndex: 0
  }),

  computed: {
    getIsSameDayDelivery() {
      return (
        this.getCartOrderDetails[this.dateModalIndex].details.timezone &&
        this.getCartOrderDetails[this.dateModalIndex].details.timezone.isSameDayDelivery
      );
    },

    getCurrentDate() {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      if (this.getIsSameDayDelivery) {
        return today.toISOString();
      } else {
        return tomorrow.toISOString();
      }
    }
  },

  methods: {
    useSameAddressMethod() {
      this.useSameAddress = !this.useSameAddress;

      if (this.useSameAddress === true) {
        const deliveryInformation = { ...this.getCartOrderDetails[0].delivery };

        this.setAllDeliveriesSameAddress(deliveryInformation);
      }
    },

    async getZipCode(index) {
      const inputZipCode = this.getCartOrderDetails[index].delivery.zipcode;

      if (inputZipCode && inputZipCode !== '') {
        const response = await this.$axios.$get(`/api/timezones?zip=${inputZipCode}`);

        this.setOrderZipCode({ index, timezone: response });

        this.dateModalValue = true;
        this.dateModalIndex = index;
      }
    },

    allowedDates: (val) => {
      return new Date(val).getDay() > 0;
    },

    saveDeliveryDate(e) {
      this.setOrderDeliveryDate({ index: this.dateModalIndex, date: e });
      this.dateModalValue = false;
    }
  }
};
</script>

<template>
  <div>
    <div
      v-for="(detail, index) in getCartOrderDetails"
      :key="index"
      :class="{ 'mt-8': index !== 0 }">
      <VCard outlined>
        <VContainer>
          <VRow>
            <VCol cols="1">
              <VImg :src="detail.product.url"></VImg>
            </VCol>

            <VCol cols="7">
              <div class="text-h6">{{ detail.product.name }}</div>
              <VListItemSubtitle>{{ detail.product.sku_type }}</VListItemSubtitle>

              <div class="mt-1">
                <p class="mb-0 grey--text text-caption">Item ID: {{ detail.product.productId }}</p>
              </div>

              <div class="text-caption mt-1" style="line-height: 1.4">
                <div
                  v-for="(extra, addOnIndex) in detail.details.productDetails.addons"
                  :key="addOnIndex">
                  <span>{{ extra.addOnOptions[0].name }} {{ `(${extra.addOnName})` }}</span>
                  <strong class="d-block pink--text">
                    <span>{{ extra.addOnOptions[0].price }}</span>
                  </strong>
                </div>
              </div>

              <VCard v-if="detail.delivery_date" class="mt-4" outlined>
                <VCardText>
                  <strong>Delivery Date:</strong>
                  <span>{{ detail.delivery_date }}</span>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="2" class="text-center" align-self="center">
              <div class="black--text text-subtitle-2">Price</div>
              <div class="text-h6 pink--text font-weight-bold">${{ detail.product.price }}</div>
            </VCol>

            <VCol cols="2" class="text-center" align-self="center">
              <div class="black--text text-subtitle-2">Subtotal</div>
              <div class="text-h6 pink--text font-weight-bold">
                ${{
                  (Math.floor(detail.details.productDetails.productPrice * 100) / 100).toFixed(2)
                }}
              </div>
            </VCol>
          </VRow>
        </VContainer>

        <VDialog v-model="dateModalValue" persistent width="100%" max-width="320">
          <VCard>
            <VCardTitle>{{ dateModalIndex }}</VCardTitle>
          </VCard>
          <VDatePicker
            :value="getCartOrderDetails[index].delivery_date"
            color="green"
            :min="getCurrentDate"
            :allowed-dates="allowedDates"
            scrollable
            @change="(e) => saveDeliveryDate(e)">
          </VDatePicker>
        </VDialog>

        <VContainer class="py-8">
          <VRow>
            <VCol cols="6">
              <VTextField
                :value="detail.delivery.firstname"
                :rules="nameRules"
                color="green"
                label="Recipient's First Name"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'firstname' })
                "></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.lastname"
                :rules="nameRules"
                color="green"
                label="Recipient's Last Name"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'lastname' })
                "></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.email"
                :rules="emailRules"
                color="green"
                label="Recipient's Email"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'email' })
                "></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.phone"
                :rules="phoneRules"
                color="green"
                label="Recipient's Phone"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'phone' })
                "></VTextField>
            </VCol>

            <VCol cols="4">
              <VTextField
                :value="detail.delivery.zipcode"
                :rules="numberRules"
                color="green"
                label="Zip/Postal Code"
                hide-details="auto"
                dense
                outlined
                :append-icon="'fas fa-arrow-right'"
                @click:append="getZipCode(index)"
                @change="
                  (e) => {
                    updateOrderDelivery({ index, value: e, key: 'zipcode' });
                  }
                "></VTextField>
            </VCol>

            <VCol cols="4">
              <VTextField
                :value="detail.delivery.state"
                :rules="textRules"
                color="green"
                label="State"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'state' })
                "></VTextField>
            </VCol>

            <VCol cols="4">
              <VTextField
                :value="detail.delivery.city"
                :rules="textRules"
                color="green"
                label="City"
                hide-details="auto"
                dense
                outlined
                @change="(e) => updateOrderDelivery({ index, value: e, key: 'city' })"></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.address1"
                :rules="textRules"
                color="green"
                label="Recipient's Address 1"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'address1' })
                "></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.address2"
                :rules="textRules"
                color="green"
                label="Recipient's Address 2"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'address2' })
                "></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.institution"
                :rules="textRules"
                color="green"
                label="Institution"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'institution' })
                "></VTextField>
            </VCol>

            <VCol cols="6">
              <VTextField
                :value="detail.delivery.institution_name"
                :rules="textRules"
                color="green"
                label="Institution Name"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'institution_name' })
                "></VTextField>
            </VCol>

            <VCol cols="12">
              <VSelect
                :items="occasions"
                :value="detail.delivery.occasionId"
                item-text="title"
                item-value="id"
                color="green"
                label="Occasions"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => {
                    updateOrderDelivery({ index, value: e, key: 'occasionId' });
                    updateOrderDelivery({
                      index,
                      value: occasions.filter((item) => item.id === e)[0].title,
                      key: 'occasion'
                    });
                  }
                "></VSelect>
            </VCol>

            <VCol cols="6">
              <VTextarea
                :value="detail.delivery.message"
                color="green"
                label="Free Card Message"
                hide-details="auto"
                dense
                outlined
                @change="
                  (e) => updateOrderDelivery({ index, value: e, key: 'message' })
                "></VTextarea>
            </VCol>

            <VCol cols="6">
              <VTextarea
                :value="detail.delivery.note"
                color="green"
                label="Note"
                hide-details="auto"
                dense
                outlined
                @change="(e) => updateOrderDelivery({ index, value: e, key: 'note' })"></VTextarea>
            </VCol>
          </VRow>

          <div v-if="index === 0" class="mt-8">
            <VCheckbox
              :value="useSameAddress"
              color="green"
              hide-details="auto"
              @click="useSameAddressMethod">
              <template #label>
                <div class="text-body-2">Use this address for all shipments</div>
              </template>
            </VCheckbox>
          </div>

          <!-- <VBtn color="green" elevation="0" class="mt-8" block dark>
            Save Address To Continue
          </VBtn> -->
        </VContainer>
      </VCard>
    </div>

    <VRow class="mt-8">
      <VCol cols="6">
        <VBtn elevation="0" @click="setCheckoutStep(1)">
          <VIcon left>fas fa-arrow-left</VIcon>
          Prev
        </VBtn>
      </VCol>
      <VCol cols="6" class="text-right">
        <VBtn color="green" elevation="0" dark @click="setCheckoutStep(3)">
          Next
          <VIcon right>fas fa-arrow-right</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
