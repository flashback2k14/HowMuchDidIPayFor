import {
  auth as firebaseAuth,
  billings,
  billingEntries,
  users,
  settings
} from "./../config/firebaseConfig";

export const auth = {
  login: async formData => {
    return await firebaseAuth.signInWithEmailAndPassword(
      formData.email,
      formData.password
    );
  },
  logout: async () => {
    return await firebaseAuth.signOut();
  }
};

export const creator = {
  billing: async (userId, formData) => {
    return await billings.add({
      billingSaldo: 0,
      currentSaldo: 0,
      isPaid: false,
      userId: userId,
      month: formData.month,
      year: formData.year,
      coveredDays: []
    });
  },
  billingEntry: async formData => {
    return await billingEntries.add({
      billingId: formData.billing,
      date: formData.date,
      hasAfternoonSnack: !!formData.hasAfternoonSnack,
      hasBreakfast: !!formData.hasBreakfast,
      hasLunch: !!formData.hasLunch,
      comment: formData.comment
    });
  },
  setting: async (userId, formData) => {
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
  billings: async userId => {
    return await billings.where("userId", "==", userId).get();
  },
  billingEntries: async billingId => {
    return await billingEntries.where("billingId", "==", billingId).get();
  },
  profile: async userId => {
    return await users.doc(userId).get();
  },
  settings: async userId => {
    return await settings.where("userId", "==", userId).get();
  }
};

export const updater = {
  billing: {
    period: async (billingId, formData) => {
      return await billings.doc(billingId).update({
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10)
      });
    },
    billingSaldo: async (billingId, formData) => {
      return await billings.doc(billingId).update({
        billingSaldo: formData.billingSaldo,
        comment: formData.comment,
        isPaid: true
      });
    },
    coveredDay: async (billingId, days, day) => {
      return await billings.doc(billingId).update({
        coveredDays: [...days, new Date(day).getDate()]
      });
    },
    currentSaldo: async (billingId, newCurrentSaldo) => {
      return await billings.doc(billingId).update({
        currentSaldo: newCurrentSaldo
      });
    }
  },
  billingEntry: async (entryId, formData) => {
    return await billingEntries.doc(entryId).update({
      billingId: formData.billing,
      date: formData.date,
      hasAfternoonSnack: !!formData.hasAfternoonSnack,
      hasBreakfast: !!formData.hasBreakfast,
      hasLunch: !!formData.hasLunch,
      comment: formData.comment
    });
  },
  setting: async (settingId, formData) => {
    return await settings.doc(settingId).update({
      breakfastPrize: parseFloat(formData.breakfastPrize),
      lunchPrize: parseFloat(formData.lunchPrize),
      afternoonSnackPrize: parseFloat(formData.afternoonSnackPrize),
      expirationDate: formData.expirationDate
    });
  }
};

export const deletter = {
  billing: async billingId => {
    return await billings.doc(billingId).delete();
  },
  billingEntry: async entry => {
    return await billingEntries.doc(entry.id).delete();
  },
  setting: async settingId => {
    return await settings.doc(settingId).delete();
  }
};
