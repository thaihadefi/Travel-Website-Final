module.exports.pathAdmin = "admin";

// Pagination Config
module.exports.paginationLimit = {
  limitItemsAdmin: 10,         // Admin pages: tour, category, order, user, contact, account, role
  limitItemsClient: 12,        // Client pages: tour list, category pages
  limitHomeFeatured: 6,        // Homepage: featured tours section
  limitHomePopular: 8,         // Homepage: popular tours sections
  limitRecentOrders: 10        // Dashboard: recent orders display
};

// Hot Deals Config
module.exports.hotDealsDeadline = "2025-12-31T23:59:59"; // Countdown deadline for hot deals section

// Swiper Config
module.exports.swiperConfig = {
  section2: {
    slidesPerView: 1,
    slidesPerGroup: 1,
    breakpoints: {
      992: {
        slidesPerView: 2,
        slidesPerGroup: 2
      },
      1200: {
        slidesPerView: 3,
        slidesPerGroup: 3
      }
    }
  },
  section3: {
    slidesPerView: 1,
    slidesPerGroup: 1,
    breakpoints: {
      576: {
        slidesPerView: 2,
        slidesPerGroup: 2
      },
      992: {
        slidesPerView: 3,
        slidesPerGroup: 3
      }
    }
  },
  boxImagesThumb: {
    slidesPerView: 4,
    slidesPerGroup: 4
  }
};

module.exports.permissionList = [
  {
    label: "View Dashboard",
    value: "dashboard-view"
  },
  {
    label: "View Category",
    value: "category-view"
  },
  {
    label: "Contact Management",
    value: "contact-view"
  },
  {
    label: "Edit Category",
    value: "category-edit"
  },
  {
    label: "Delete Category",
    value: "category-delete"
  },
  {
    label: "Category Trash",
    value: "category-trash"
  },
  {
    label: "View Tour",
    value: "tour-view"
  },
  {
    label: "Create Tour",
    value: "tour-create"
  },
  {
    label: "Edit Tour",
    value: "tour-edit"
  },
  {
    label: "Delete Tour",
    value: "tour-delete"
  },
  {
    label: "Tour Trash",
    value: "tour-trash"
  },
  {
    label: "View Customers",
    value: "user-view"
  },
  {
    label: "Message Management",
    value: "message-view"
  },
];

module.exports.paymentMethodList = [
  {
    label: "Cash",
    value: "money"
  },
  {
    label: "Bank Transfer",
    value: "bank"
  },
  {
    label: "VNPay",
    value: "vnpay"
  },
  {
    label: "ZaloPay",
    value: "zalopay"
  },
]

module.exports.paymentStatusList = [
  {
    label: "Unpaid",
    value: "unpaid"
  },
  {
    label: "Paid",
    value: "paid"
  },
]

module.exports.statusList = [
  {
    label: "Initial",
    value: "initial",
    color: "orange"
  },
  {
    label: "Done",
    value: "done",
    color: "green"
  },
  {
    label: "Cancelled",
    value: "cancel",
    color: "red"
  },
]