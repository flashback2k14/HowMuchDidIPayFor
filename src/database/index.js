import {
  auth as firebaseAuth,
  billings,
  billingEntries,
  users,
  settings
} from "@/config/firebaseConfig";

export const auth = {
  login: async function(formData) {
    return await firebaseAuth.signInWithEmailAndPassword(
      formData.email,
      formData.password
    );
  },
  logout: async function() {
    return await firebaseAuth.signOut();
  }
};

export const creator = {
  billing: async function(userId, formData) {
    return await billings.add({
      billingSaldo: 0,
      currentSaldo: 0,
      isPaid: false,
      userId: userId,
      month: formData.month,
      year: formData.year
    });
  },
  billingEntry: async function(formData) {
    return await billingEntries.add({
      billingId: formData.billing,
      date: formData.date,
      hasAfternoonSnack: !!formData.hasAfternoonSnack,
      hasBreakfast: !!formData.hasBreakfast,
      hasLunch: !!formData.hasLunch,
      comment: formData.comment
    });
  },
  setting: async function(userId, formData) {
    return await settings.add({
      breakfastPrize: parseFloat(formData.breakfastPrize),
      lunchPrize: parseFloat(formData.lunchPrize),
      afternoonSnackPrize: parseFloat(formData.afternoonSnackPrize),
      expirationDate: formData.expirationDate,
      userId: userId
    });
  }
};

export const reader = {
  billings: async function(userId) {
    return await billings.where("userId", "==", userId).get();
  },
  billingEntries: async function(billingId) {
    return await billingEntries.where("billingId", "==", billingId).get();
  },
  profile: async function(userId) {
    return await users.doc(userId).get();
  },
  settings: async function(userId) {
    return await settings.where("userId", "==", userId).get();
  }
};

export const updater = {
  billing: {
    period: async function(billingId, formData) {
      return await billings.doc(billingId).update({
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10)
      });
    },
    billingSaldo: async function(billingId, formData) {
      return await billings.doc(billingId).update({
        billingSaldo: formData.billingSaldo,
        comment: formData.comment,
        isPaid: true
      });
    },
    currentSaldo: async function(billingId, newCurrentSaldo) {
      return await billings.doc(billingId).update({
        currentSaldo: newCurrentSaldo
      });
    }
  },
  billingEntry: async function() {
    throw new Error("updater - billingEntry not implemented");
  },
  setting: async function(settingId, formData) {
    return await settings.doc(settingId).update({
      breakfastPrize: parseFloat(formData.breakfastPrize),
      lunchPrize: parseFloat(formData.lunchPrize),
      afternoonSnackPrize: parseFloat(formData.afternoonSnackPrize),
      expirationDate: formData.expirationDate
    });
  }
};

export const deletter = {
  billing: async function(billingId) {
    return await billings.doc(billingId).delete();
  },
  billingEntry: async function(entry) {
    return await billingEntries.doc(entry.id).delete();
  },
  setting: async function(settingId) {
    return await settings.doc(settingId).delete();
  }
};
